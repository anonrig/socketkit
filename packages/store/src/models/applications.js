import pg from '../pg.js'
import Logger from '../logger.js'

export async function exist(trx, application_ids) {
  const rows = await pg
    .queryBuilder()
    .transacting(trx)
    .from('applications')
    .whereIn('application_id', application_ids)
    .select('application_id')

  return rows.map((r) => r.application_id)
}

export function findAll({ application_ids, bundle_ids, developer_ids }) {
  return pg
    .queryBuilder()
    .select({
      application_id: 'a.application_id',
      developer_id: 'a.developer_id',
      developer_name: 'd.name',
      bundle_id: 'a.bundle_id',
      title: 'v.title',
      description: 'v.description',
      release_notes: 'v.release_notes',
      icon: 'v.icon',
      store_url: 'v.store_url',
      languages: 'v.languages',
      screenshots: 'v.screenshots',
      version: 'v.version_number',
      ratings: 'r.rating_histogram',
      released_at: 'a.released_at',
      version_released_at: 'v.released_at',
    })
    .from('applications AS a')
    .joinRaw(
      `
      CROSS JOIN LATERAL (
        SELECT *
        FROM application_versions
        WHERE application_id = a.application_id
        ORDER BY released_at DESC
        LIMIT 1
      ) AS v
    `,
    )
    .join('application_ratings as r', function () {
      this.on('r.application_id', 'a.application_id').andOn(
        'r.country_id',
        'v.country_id',
      )
    })
    .join('developers as d', 'd.developer_id', 'a.developer_id')
    .where(function () {
      if (application_ids?.length > 0) {
        this.whereIn('a.application_id', application_ids)
      }

      if (bundle_ids?.length > 0) {
        this.whereIn('a.bundle_id', bundle_ids)
      }

      if (developer_ids?.length > 0) {
        this.whereIn('d.developer_id', developer_ids)
      }
    })
    .orderBy('v.released_at', 'DESC')
}

export function findVersions({ application_id, bundle_id }) {
  return pg
    .queryBuilder()
    .select({
      application_id: 'a.application_id',
      developer_id: 'a.developer_id',
      bundle_id: 'a.bundle_id',
      title: 'v.title',
      description: 'v.description',
      release_notes: 'v.release_notes',
      icon: 'v.icon',
      store_url: 'v.store_url',
      languages: 'v.languages',
      screenshots: 'v.screenshots',
      version: 'v.version_number',
      ratings: 'r.rating_histogram',
      released_at: 'a.released_at',
      version_released_at: 'v.released_at',
    })
    .from('application_versions AS v')
    .innerJoin('applications AS a', function () {
      this.on('v.application_id', 'a.application_id')
    })
    .join('application_ratings as r', function () {
      this.on('r.application_id', 'v.application_id').andOn(
        'r.country_id',
        'v.country_id',
      )
    })
    .where(function () {
      if (application_id) {
        this.where('a.application_id', application_id)
      }

      if (bundle_id) {
        this.where('a.bundle_id', bundle_id)
      }
    })
    .orderBy('v.released_at', 'desc')
}

export async function create(trx, scraped_app) {
  const logger = Logger.create()
    .withScope('application-create')
    .withTag(scraped_app.detail.title)

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('developers')
    .insert({
      developer_id: scraped_app.detail.developerId,
      name: scraped_app.detail.developer,
      store_url: scraped_app.detail.developerUrl,
      website: scraped_app.detail.developerWebsite,
    })
    .onConflict(['developer_id'])
    .ignore()

  logger.debug('Developer created')

  await pg.queryBuilder().transacting(trx).into('applications').insert({
    application_id: scraped_app.application_id,
    developer_id: scraped_app.detail.developerId,
    bundle_id: scraped_app.detail.appId,
    released_at: scraped_app.detail.released,
    default_country_id: scraped_app.default_country_id,
  })

  logger.debug('Application created')

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_versions')
    .insert(prepareApplicationVersion(scraped_app))

  logger.debug('Application version created')

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_ratings')
    .insert({
      application_id: scraped_app.application_id,
      country_id: scraped_app.default_country_id,
      rating_histogram: Object.values(scraped_app.detail.histogram),
    })

  logger.debug('Application rating created')
}

export async function upsert(trx, scraped_apps) {
  const logger = Logger.create().withScope('applications-upsert')

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('applications')
    .whereIn(
      'application_id',
      scraped_apps.map((s) => s.application_id),
    )
    .update('last_fetch', pg.fn.now())

  logger.debug('Application last_fetch updated')

  await pg
    .queryBuilder()
    .into('application_versions')
    .insert(scraped_apps.map(prepareApplicationVersion))
    .onConflict(['application_id', 'country_id', 'version_number'])
    .ignore()
    .transacting(trx)

  logger.debug('Application versions upserted')

  await Promise.all(
    scraped_apps.map((s) =>
      pg
        .queryBuilder()
        .transacting(trx)
        .into('application_ratings')
        .where({
          application_id: s.application_id,
          country_id: s.default_country_id,
        })
        .update('rating_histogram', Object.values(s.detail.histogram)),
    ),
  )

  logger.debug('Application ratings updated')
}

function prepareApplicationVersion(scraped_app) {
  return {
    score: scraped_app.detail.score,
    reviews: scraped_app.detail.reviews,
    released_at: scraped_app.detail.updated,
    price: scraped_app.detail.price,
    release_notes: scraped_app.detail.releaseNotes,
    application_id: scraped_app.application_id,
    country_id: scraped_app.default_country_id,
    version_number: scraped_app.detail.version,
    title: scraped_app.detail.title,
    description: scraped_app.detail.description,
    icon: scraped_app.detail.icon,
    size: scraped_app.detail.size,
    required_os_version: scraped_app.detail.requiredOsVersion,
    store_url: scraped_app.detail.url,
    currency_id: scraped_app.detail.currency,
    languages: scraped_app.detail.languages,
    screenshots: {
      default: scraped_app.detail.screenshots ?? [],
      ipad: scraped_app.detail.ipadScreenshots ?? [],
      appletv: scraped_app.detail.appletvScreenshots ?? [],
    },
    website: scraped_app.detail.website,
    content_rating: scraped_app.detail.contentRating,
  }
}
