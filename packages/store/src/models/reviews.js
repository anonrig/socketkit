import scraper from 'appstore-sensor'
import tunnel from 'tunnel'
import config from '../config.js'
import pg from '../pg.js'
import Logger from '../logger.js'

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

  const reviews = await scraper.reviews(
    {
      id: application_id,
      country: country_id,
      page,
      sort: 'mostRecent',
    },
    {
      timeout: 5000,
      agent: config.proxy
        ? {
            https: tunnel.httpsOverHttp({
              proxy: config.proxy,
            }),
          }
        : undefined,
    },
  )

  logger.debug(`Fetched ${reviews.length} reviews`)

  if (reviews.length === 0) {
    return
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
    .merge()
    .transacting(trx)
}
