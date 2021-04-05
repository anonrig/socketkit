import pg from '../pg.js'
import Logger from '../logger.js'
import { scrapeReviews } from '../requests/app-store.js'
import dayjs from 'dayjs'

export async function findAll(
  { application_ids, country_ids, version_ids },
  { cursor, limit = 10 },
) {
  return pg
    .queryBuilder()
    .select('*')
    .from('reviews')
    .whereIn('application_id', application_ids)
    .andWhere(function () {
      if (country_ids?.length) {
        this.whereIn('country_id', country_ids)
      }

      if (version_ids?.length) {
        this.andWhereIn('version_number', version_ids)
      }

      if (cursor) {
        const { review_id } = cursor

        if (!review_id) {
          throw new Error(`Invalid cursor for pagination`)
        }

        this.whereRaw(`(review_id) < (?)`, [review_id])
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
          version_number: review.version,
          country_id,
          score: review.score,
          username: review.userName,
          user_url: review.userUrl,
          review_url: review.url,
          title: review.title,
          content: review.text,
        })),
      )
      .into('reviews')
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
