import pg from '../pg.js'
import Logger from '../logger.js'
import { scrapeReviews } from '../requests/app-store.js'
import dayjs from 'dayjs'

export async function findAll({
  application_id,
  country_id,
  version,
  limit = 10,
}) {
  return pg
    .queryBuilder()
    .select('*')
    .from('application_reviews')
    .where({ application_id })
    .andWhere(function () {
      if (country_id) {
        this.andWhere({ country_id })
      }

      if (version) {
        this.andWhere({ version })
      }
    })
    .orderBy('review_id', 'desc')
    .limit(limit)
}

export async function create({ application_id, country_id, page = 1 }, trx) {
  const logger = Logger.create()
    .withScope('application-reviews')
    .withTag(application_id)

  logger.debug(`Fetching reviews for country ${country_id} using page ${page}`)

  try {
    const reviews = await scrapeReviews(application_id, country_id, page)

    logger.debug(`Fetched ${reviews.length} reviews`)

    if (reviews.length === 0) {
      return null
    }

    await pg
      .queryBuilder()
      .insert(
        reviews.map((review) => ({
          review_id: review.id,
          application_id: application_id,
          version: review.version,
          country_id,
          score: review.score,
          username: review.userName,
          user_url: review.userUrl,
          url: review.url,
          title: review.title,
          text: review.text,
        })),
      )
      .into('application_reviews')
      .onConflict(['review_id'])
      .ignore()
      .transacting(trx)

    await pg
      .queryBuilder()
      .update({ last_fetch: dayjs() })
      .from('reviews_watchlist')
      .where({ application_id, country_id })
      .transacting(trx)

  } catch (error) {
    logger.fatal(
      `Uncaught exception on reviews fetch for application_id=${application_id} country_id=${country_id}`,
    )
    logger.fatal(error)
    return null
  }
}
