import PromisePool from '@supercharge/promise-pool'
import dayjs from 'dayjs'
import _ from 'lodash'

import config from '../config.js'
import Logger from '../logger.js'
import * as Applications from '../models/applications.js'
import pg from '../pg.js'
import * as AppStore from '../requests/app-store.js'

export default function fetchApplications(
  limit = config.applications_batch_size,
) {
  const logger = Logger.create().withScope('fetchApplications')

  return pg.transaction(async (trx) => {
    const applications = await pg
      .queryBuilder()
      .select([
        'a.application_id',
        'a.default_country_id',
        'a.failed_fetches',
        'av.language_ids',
      ])
      .from('applications AS a')
      .limit(limit)
      .join('application_releases AS ar', function () {
        this.on('a.application_id', 'ar.application_id').andOn(
          'a.default_country_id',
          'ar.country_id',
        )
      })
      .join('application_versions AS av', function () {
        this.on('a.application_id', 'av.application_id').andOn(
          'ar.latest_version_number',
          'av.version_number',
        )
      })
      .where(
        'a.last_fetch',
        '<',
        dayjs().subtract(config.applications_fetch_interval, 'hours'),
      )
      .andWhere('a.is_active', true)
      .forUpdate()
      .skipLocked()
      .transacting(trx)

    if (applications.length === 0) {
      return 0
    }

    let enabled_applications = []

    for (let app of applications) {
      try {
        await AppStore.scrapeApp(app.application_id, app.default_country_id)
        enabled_applications.push(app)
      } catch (error) {
        if (error.message?.includes('404')) {
          await pg
            .queryBuilder()
            .update({
              last_error_message: error.message,
              failed_fetches: app.failed_fetches + 1,
              is_active: false,
            })
            .where({ application_id: app.application_id })
            .from('applications')
            .transacting(trx)
        } else {
          logger.warn(error)
        }
      }
    }

    const parseLanguages = async (app, country, languages) => {
      const { results, errors } = await PromisePool.for(languages)
        .withConcurrency(5)
        .process((language) =>
          AppStore.scrapeApp(app.application_id, country, language),
        )

      if (errors.length) {
        logger.warn(errors)
      }

      return results
    }

    const { results, errors } = await PromisePool.for(enabled_applications)
      .withConcurrency(config.applications_batch_size)
      .process(async (app) =>
        parseLanguages(app, app.default_country_id, app.language_ids),
      )

    if (errors.length) {
      logger.warn(errors)
    }

    // We don't throw errors for not found application requests.
    const normalized = results.flat().filter((v) => !!v)

    if (normalized.length) {
      await Applications.upsert(normalized, trx)
    }

    if (enabled_applications.length > normalized.length) {
      const different_applications = _.difference(
        applications,
        normalized,
        (a, n) => a.application_id === n.application_id,
      )

      // We should update last_fetch for not found applications.
      // This prevents us from inhibiting progress.
      if (different_applications.length > 0) {
        await pg
          .queryBuilder()
          .update({
            last_fetch: dayjs(),
            last_error_message: null,
            failed_fetches: 0,
          })
          .from('applications')
          .whereIn(
            'application_id',
            different_applications.map((a) => a.application_id),
          )
          .transacting(trx)
      }
    }

    return enabled_applications.length
  })
}
