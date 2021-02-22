import pg from '../pg.js'
import store from 'app-store-scraper'
import Logger from '../logger.js'

export async function findAll({ application_ids, bundle_ids, developer_ids }) {
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
      version: 'v.version',
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

export async function findOne({ application_id, bundle_id }) {
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
      version: 'v.version',
      ratings: 'r.rating_histogram',
      released_at: 'a.released_at',
      version_released_at: 'v.released_at',
    })
    .from('applications AS a')
    .innerJoin('application_versions AS v', function () {
      this.on('v.application_id', 'a.application_id')
    })
    .join('application_ratings as r', function () {
      this.on('r.application_id', 'a.application_id').andOn(
        'r.country_id',
        'v.country_id',
      )
    })
    .where(function () {
      if (application_id?.length > 0) {
        this.where('a.application_id', application_id)
      }

      if (bundle_id?.length > 0) {
        this.andWhere('a.bundle_id', bundle_id)
      }
    })
    .orderBy('v.released_at', 'DESC')
    .first()
}

export async function findVersions({ application_id, bundle_id }) {
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
      version: 'v.version',
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

export async function update({ application_id }, values, trx) {
  return pg
    .queryBuilder()
    .update(values)
    .from('applications')
    .where({ application_id })
    .transacting(trx)
}

export async function create({ application_id, country_id }, trx) {
  const data = await store.app({ id: application_id, ratings: true })
  const logger = Logger.create()
    .withScope('application-create')
    .withTag(data.title)

  await pg
    .queryBuilder()
    .insert({
      developer_id: data.developerId,
      name: data.developer,
      store_url: data.developerUrl,
      website: data.developerWebsite,
    })
    .into('developers')
    .onConflict(['developer_id'])
    .ignore()
    .transacting(trx)

  logger.debug('Developer created')

  // create application
  await pg
    .queryBuilder()
    .insert({
      application_id,
      developer_id: data.developerId,
      bundle_id: data.appId,
      released_at: data.released,
    })
    .into('applications')
    .onConflict(['application_id'])
    .ignore()
    .transacting(trx)

  logger.debug('Application created')

  // create application version if not exists
  await pg
    .queryBuilder()
    .insert({
      score: data.score,
      reviews: data.reviews,
      released_at: data.updated,
      price: data.price,
      release_notes: data.releaseNotes,
      application_id: data.id,
      country_id,
      version: data.version,
      title: data.title,
      description: data.description,
      icon: data.icon,
      size: data.size,
      required_os_version: data.requiredOsVersion,
      store_url: data.url,
      currency_id: data.currency,
      languages: data.languages,
      screenshots: {
        default: data.screenshots ?? [],
        ipad: data.ipadScreenshots ?? [],
        appletv: data.appletvScreenshots ?? [],
      },
      website: data.website,
      content_rating: data.contentRating,
    })
    .into('application_versions')
    .onConflict(['application_id', 'country_id', 'version'])
    .ignore()
    .transacting(trx)

  logger.debug('Application version created')

  // update histogram
  await pg
    .queryBuilder()
    .insert({
      application_id: data.id,
      country_id,
      rating_histogram: Object.values(data.histogram),
    })
    .into('application_ratings')
    .onConflict(['application_id', 'country_id'])
    .merge()
    .transacting(trx)

  logger.debug('Application rating updated')

  return {}
}
