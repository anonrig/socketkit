import store from 'app-store-scraper'
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

  const reviews = await store.reviews({
    id: application_id,
    country: country_id,
    page,
    sort: store.sort.RECENT,
  })

  logger.debug(`Fetched ${reviews.length} reviews`)

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
