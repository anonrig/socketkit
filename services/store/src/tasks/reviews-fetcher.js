import PromisePool from '@supercharge/promise-pool'
import dayjs from 'dayjs'

import config from '../config.js'
import Logger from '../logger.js'
import * as Reviews from '../models/reviews.js'
import pg from '../pg.js'
import * as AppStore from '../requests/app-store.js'

export default function fetchReviews(limit = config.reviews_batch_size) {
  const logger = Logger.create().withScope('fetchReviews')

  return pg.transaction(async (trx) => {
    const applications = await pg
      .queryBuilder()
      .select(['wl.application_id', 'wl.country_id'])
      .from('reviews_watchlist as wl')
      .where(
        'wl.last_fetch',
        '<',
        dayjs().subtract(config.reviews_fetch_interval, 'minutes'),
      )
      .andWhere('wl.is_active', true)
      .limit(limit)
      .forUpdate()
      .skipLocked()
      .transacting(trx)

    if (applications.length === 0) {
      logger.debug('Received 0 applications')
      return 0
    }

    logger.debug(`Found ${applications.length} applications`)

    const enabled_applications = []
    for (let app of applications) {
      try {
        await AppStore.scrapeApp(app.application_id, app.country_id)
        enabled_applications.push(app)
      } catch (error) {
        logger.warn(error)
        const failed_fetches = (app.failed_fetches ?? 0) + 1

        await pg
          .queryBuilder()
          .update({
            is_active: failed_fetches !== 3,
            last_fetch: dayjs(),
            last_error_message: error.message,
            failed_fetches,
          })
          .from('reviews_watchlist')
          .where({
            application_id: app.application_id,
            country_id: app.country_id,
          })
          .transacting(trx)
      }
    }

    const { results, errors } = await PromisePool.for(enabled_applications)
      .withConcurrency(config.reviews_batch_size)
      .process(({ application_id, country_id }) =>
        Reviews.create({ application_id, country_id, page: 1 }, trx),
      )

    if (errors.length) {
      logger.warn(errors)
    }

    return results.length
  })
}
