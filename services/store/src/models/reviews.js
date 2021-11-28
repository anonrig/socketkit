import dayjs from 'dayjs'

import Logger from '../logger.js'
import pg from '../pg.js'
import { scrapeReviews } from '../requests/app-store.js'

export async function findAll(
  { application_ids, country_ids, version_ids },
  { cursor, limit = 10, start_date, end_date },
) {
  if (application_ids.length === 0) {
    throw new Error(`Application id list is empty`)
  }

  return pg
    .queryBuilder()
    .select('*')
    .from('reviews')
    .whereIn('application_id', application_ids)
    .andWhere(function () {
      if (country_ids.length > 0) {
        this.whereIn('country_id', country_ids)
      }

      if (version_ids.length > 0) {
        this.whereIn('version_number', version_ids)
      }

      if (start_date && end_date) {
        this.whereBetween('updated_at', [
          dayjs(start_date).format('YYYY-MM-DD'),
          dayjs(end_date).format('YYYY-MM-DD'),
        ])
      }

      if (cursor) {
        const { review_id, updated_at } = cursor

        if (!review_id || !updated_at) {
          throw new Error(`Invalid cursor for pagination`)
        }

        this.whereRaw(`(updated_at, review_id) < (?, ?)`, [dayjs(updated_at).toDate(), review_id])
      }
    })
    .orderByRaw(`updated_at desc, review_id desc`)
    .limit(limit)
}

export async function findVersions({ application_id }) {
  return pg
    .queryBuilder()
    .select({
      released_at: 'av.released_at',
      version: pg.raw(`DISTINCT(r.version_number)`),
    })
    .from('reviews AS r')
    .where('r.application_id', application_id)
    .leftJoin('application_versions AS av', function () {
      this.on('av.application_id', 'r.application_id').andOn(
        'av.version_number',
        'r.version_number',
      )
    })
    .orderBy('version', 'desc')
}

export async function findCountries({ account_id, application_id }) {
  return pg
    .queryBuilder()
    .select({ country_id: pg.raw('DISTINCT(country_id)') })
    .from('integrations')
    .where({ account_id })
    .andWhere(function () {
      if (application_id) {
        this.andWhere({ application_id })
      }
    })
}

export async function create({ application_id, country_id, page = 1 }, trx) {
  const logger = Logger.create().withScope('application-reviews').withTag(application_id)

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
          application_id: application_id,
          content: review.text,
          country_id,
          review_id: review.id,
          review_url: review.url,
          score: review.score,
          title: review.title,
          updated_at: review.updatedAt,
          user_url: review.userUrl,
          username: review.userName,
          version_number: review.version,
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
      .onConflict(['application_id', 'country_id'])
      .ignore()
  } catch (error) {
    logger.fatal(
      `Uncaught exception on reviews fetch for application_id=${application_id} country_id=${country_id}`,
    )
    logger.fatal(error)
    return null
  }
}
