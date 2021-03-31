import PromisePool from '@supercharge/promise-pool'
import dayjs from 'dayjs'
import _ from 'lodash'
import pg from '../pg.js'
import * as AppStore from '../requests/app-store.js'
import * as Reviews from '../models/reviews.js'
import Logger from '../logger.js'
import config from '../config.js'

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
      return 0
    }

    const enabled_applications = []
    for (let app of applications) {
      try {
        await AppStore.scrapeApp(app.application_id, app.country_id)
        enabled_applications.push(app)
      } catch (error) {
        logger.warn(error)
        await pg
          .queryBuilder()
          .update({
            is_active: false,
            last_fetch: dayjs(),
            last_error_message: error.message,
          })
          .from('application_reviews_watchlist')
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
