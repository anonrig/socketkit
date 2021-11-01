import _ from 'lodash'
import pg from '../pg.js'
import Logger from '../logger.js'
import dayjs from 'dayjs'
import * as Requests from '../requests/app-store.js'

export async function search({ text, country_id }) {
  const results = await Requests.search(text, country_id)

  return results.map((r) => ({
    application_id: r.id,
    bundle_id: r.appId,
    application_title: r.title,
    application_icon: r.icon,
  }))
}

export async function exist(
  application_ids,
  trx,
  returns = ['application_id'],
) {
  const rows = await pg
    .queryBuilder()
    .transacting(trx)
    .from('applications')
    .whereIn('application_id', application_ids)
    .select(returns)

  return returns.length == 1 ? rows.map((r) => r[returns[0]]) : rows
}

export function findAllSimplified({
  application_ids,
  bundle_ids,
  developer_ids,
}) {
  if (
    application_ids.length === 0 &&
    bundle_ids.length === 0 &&
    developer_ids.length === 0
  ) {
    return []
  }

  return pg
    .queryBuilder()
    .select({
      application_id: 'a.application_id',
      bundle_id: 'a.bundle_id',
      title: 'avc.title',
      released_at: 'a.released_at',
      developer_id: 'a.developer_id',
      developer_name: 'd.name',
      application_icon: 'av.icon',
    })
    .from('applications AS a')
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
    .join('application_version_contents AS avc', function () {
      this.on('a.application_id', 'avc.application_id')
        .andOn('ar.latest_version_number', 'avc.version_number')
        .andOn('ar.default_language_id', 'avc.language_id')
    })
    .join('developers as d', 'd.developer_id', 'a.developer_id')
    .where(function () {
      if (application_ids.length > 0) {
        this.whereIn('a.application_id', application_ids)
      }

      if (bundle_ids.length > 0) {
        this.whereIn('a.bundle_id', bundle_ids)
      }

      if (developer_ids.length > 0) {
        this.whereIn('d.developer_id', developer_ids)
      }
    })
    .orderBy('a.released_at', 'DESC')
}

export function findAll({ application_ids, bundle_ids, developer_ids }) {
  return pg
    .queryBuilder()
    .select({
      application_id: 'a.application_id',
      developer_id: 'a.developer_id',
      developer_name: 'd.name',
      developer_url: 'd.store_url',
      bundle_id: 'a.bundle_id',
      title: 'avc.title',
      description: 'avc.description',
      release_notes: 'avc.release_notes',
      icon: 'av.icon',
      store_url: 'ar.store_url',
      languages: 'av.language_ids',
      screenshots: 'avc.screenshots',
      version: 'ar.latest_version_number',
      ratings: 'ar.rating_histogram',
      released_at: 'a.released_at',
      version_released_at: 'av.released_at',
      reviews: 'ar.reviews',
      score: 'ar.score',
      price: 'ar.price',
      currency: 'ar.currency_id',
      content_rating: 'av.content_rating',
      required_os_version: 'av.required_os_version',
      size: 'av.size',
    })
    .from('applications AS a')
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
    .join('application_version_contents AS avc', function () {
      this.on('a.application_id', 'avc.application_id')
        .andOn('ar.latest_version_number', 'avc.version_number')
        .andOn('ar.default_language_id', 'avc.language_id')
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
    .orderBy('av.released_at', 'DESC')
}

export function findVersions({ application_id, bundle_id }) {
  return pg
    .queryBuilder()
    .select({
      version: 'av.version_number',
      released_at: 'av.released_at',
    })
    .from('applications AS a')
    .innerJoin('application_releases AS ar', function () {
      this.on('a.application_id', 'ar.application_id').andOn(
        'a.default_country_id',
        'ar.country_id',
      )
    })
    .innerJoin('application_versions AS av', function () {
      this.on('a.application_id', 'av.application_id')
    })
    .where(function () {
      if (application_id) {
        this.where('a.application_id', application_id)
      }

      if (bundle_id) {
        this.where('a.bundle_id', bundle_id)
      }
    })
    .orderBy('av.released_at', 'DESC')
}

export function findVersion({ application_id, bundle_id, version }) {
  return pg
    .queryBuilder()
    .select({
      application_id: 'a.application_id',
      bundle_id: 'a.bundle_id',
      screenshots: 'avc.screenshots',
      title: 'avc.title',
      description: 'avc.description',
      release_notes: 'avc.release_notes',
      languages: 'av.language_ids',
      version: 'ar.latest_version_number',
      ratings: 'ar.rating_histogram',
      released_at: 'av.released_at',
      price: 'ar.price',
      currency: 'ar.currency_id',
      content_rating: 'av.content_rating',
      required_os_version: 'av.required_os_version',
      size: 'av.size',
      reviews: 'ar.reviews',
      score: 'ar.score',
    })
    .from('applications AS a')
    .join('developers as d', 'd.developer_id', 'a.developer_id')
    .innerJoin('application_versions AS av', function () {
      this.on('av.application_id', 'a.application_id')
    })
    .innerJoin('application_releases AS ar', function () {
      this.on('a.application_id', 'ar.application_id').andOn(
        'a.default_country_id',
        'ar.country_id',
      )
    })
    .join('application_version_contents AS avc', function () {
      this.on('a.application_id', 'avc.application_id')
        .andOn('av.version_number', 'avc.version_number')
        .andOn('ar.default_language_id', 'avc.language_id')
    })
    .where(function () {
      if (application_id) {
        this.where('a.application_id', application_id)
      }

      if (bundle_id) {
        this.where('a.bundle_id', bundle_id)
      }

      this.where('av.version_number', version)
    })
    .first()
}

export async function create(trx, scraped_apps) {
  const developers = scraped_apps.reduce((i, s) => {
    i[s.detail.developerId] = {
      developer_id: s.detail.developerId,
      name: s.detail.developer,
      store_url: s.detail.developerUrl,
      website: s.detail.developerWebsite ?? null,
    }

    return i
  }, {})

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('developers')
    .insert(Object.values(developers))
    .onConflict(['developer_id'])
    .ignore()

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('applications')
    .insert(
      scraped_apps.map((s) => ({
        application_id: s.application_id,
        developer_id: s.detail.developerId,
        bundle_id: s.detail.appId,
        last_fetch: s.detail.released,
        released_at: s.detail.released,
        default_country_id: s.default_country_id.toLowerCase(),
        last_error_message: null,
        is_active: true,
      })),
    )

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_releases')
    .insert(
      scraped_apps.map((s) => ({
        application_id: s.application_id,
        country_id: s.country_id.toLowerCase(),
        reviews: s.detail.reviews,
        score: s.detail.score,
        price: s.detail.price,
        currency_id: s.detail.currency,
        default_language_id: s.default_language_id.toUpperCase(),
        latest_version_number: s.detail.version,
        store_url: s.detail.url,
        rating_histogram: Object.values(s.detail.histogram),
      })),
    )

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_versions')
    .insert(
      scraped_apps.map((s) => ({
        released_at: s.detail.updated,
        application_id: s.application_id,
        version_number: s.detail.version,
        default_language_id: s.default_language_id.toUpperCase(),
        icon: s.detail.icon,
        size: s.detail.size,
        required_os_version: s.detail.requiredOsVersion,
        language_ids: s.detail.languages.map((l) => l.toUpperCase()),
        website: s.detail.website,
        content_rating: s.detail.contentRating,
      })),
    )

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_version_contents')
    .insert(
      scraped_apps.map((s) => ({
        application_id: s.application_id,
        fetched_country_id: s.country_id.toLowerCase(),
        language_id: s.default_language_id.toUpperCase(),
        version_number: s.detail.version,
        title: s.detail.title,
        description: s.detail.description,
        release_notes: s.detail.releaseNotes,
        screenshots: {
          default: s.detail.screenshots || [],
          ipad: s.detail.ipadScreenshots || [],
          appletv: s.detail.appletvScreenshots || [],
        },
      })),
    )

  return {}
}

export async function upsert(applications, trx) {
  const logger = Logger.create().withScope('applications-upsert')

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('applications')
    .whereIn(
      'application_id',
      applications.filter((a) => !!a).map((a) => a.application_id),
    )
    .update('last_fetch', dayjs())

  logger.debug('Applications last_fetch updated')

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_releases')
    .insert(
      _.uniqBy(
        applications.map((s) => ({
          application_id: s.application_id,
          country_id: s.country_id,
          reviews: s.detail.reviews,
          score: s.detail.score,
          price: s.detail.price,
          currency_id: s.detail.currency,
          default_language_id: s.default_language_id,
          latest_version_number: s.detail.version,
          store_url: s.detail.url,
          rating_histogram: Object.values(s.detail.histogram ?? {}),
        })),
        ({ application_id, country_id }) => `${application_id}-${country_id}`,
      ),
    )
    .onConflict(['application_id', 'country_id'])
    .merge()

  logger.debug('Application releases created')

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_versions')
    .insert(
      applications.map((s) => ({
        released_at: s.detail.updated,
        application_id: s.application_id,
        version_number: s.detail.version,
        default_language_id: s.default_language_id,
        icon: s.detail.icon,
        size: s.detail.size,
        required_os_version: s.detail.requiredOsVersion,
        language_ids: s.detail.languages,
        website: s.detail.website,
        content_rating: s.detail.contentRating,
      })),
    )
    .onConflict(['application_id', 'version_number'])
    .ignore()

  logger.debug('New application versions created')

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_version_contents')
    .insert(
      applications.map((s) => ({
        application_id: s.application_id,
        fetched_country_id: s.country_id,
        language_id: s.default_language_id.toUpperCase(),
        version_number: s.detail.version,
        title: s.detail.title,
        description: s.detail.description,
        release_notes: s.detail.releaseNotes,
        screenshots: {
          default: s.detail.screenshots || [],
          ipad: s.detail.ipadScreenshots || [],
          appletv: s.detail.appletvScreenshots || [],
        },
      })),
    )
    .onConflict(['application_id', 'version_number', 'language_id'])
    .ignore()

  logger.debug('New application version contents created')
  return {}
}