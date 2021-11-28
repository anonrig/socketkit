import dayjs from 'dayjs'
import _ from 'lodash'

import Logger from '../logger.js'
import pg from '../pg.js'
import * as Requests from '../requests/app-store.js'

export async function search({ text, country_id }) {
  const results = await Requests.search(text, country_id)

  return results.map((r) => ({
    application_icon: r.icon,
    application_id: r.id,
    application_title: r.title,
    bundle_id: r.appId,
  }))
}

export async function exist(application_ids, trx, returns = ['application_id']) {
  const rows = await pg
    .queryBuilder()
    .transacting(trx)
    .from('applications')
    .whereIn('application_id', application_ids)
    .select(returns)

  return returns.length == 1 ? rows.map((r) => r[returns[0]]) : rows
}

export function findAllSimplified({ application_ids, bundle_ids, developer_ids }) {
  if (application_ids.length === 0 && bundle_ids.length === 0 && developer_ids.length === 0) {
    return []
  }

  return pg
    .queryBuilder()
    .select({
      application_icon: 'av.icon',
      application_id: 'a.application_id',
      bundle_id: 'a.bundle_id',
      developer_id: 'a.developer_id',
      developer_name: 'd.name',
      released_at: 'a.released_at',
      title: 'avc.title',
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
      bundle_id: 'a.bundle_id',
      content_rating: 'av.content_rating',
      currency: 'ar.currency_id',
      description: 'avc.description',
      developer_id: 'a.developer_id',
      developer_name: 'd.name',
      developer_url: 'd.store_url',
      icon: 'av.icon',
      languages: 'av.language_ids',
      price: 'ar.price',
      ratings: 'ar.rating_histogram',
      release_notes: 'avc.release_notes',
      released_at: 'a.released_at',
      required_os_version: 'av.required_os_version',
      reviews: 'ar.reviews',
      score: 'ar.score',
      screenshots: 'avc.screenshots',
      size: 'av.size',
      store_url: 'ar.store_url',
      title: 'avc.title',
      version: 'ar.latest_version_number',
      version_released_at: 'av.released_at',
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
      released_at: 'av.released_at',
      version: 'av.version_number',
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
      content_rating: 'av.content_rating',
      currency: 'ar.currency_id',
      description: 'avc.description',
      languages: 'av.language_ids',
      price: 'ar.price',
      ratings: 'ar.rating_histogram',
      release_notes: 'avc.release_notes',
      released_at: 'av.released_at',
      required_os_version: 'av.required_os_version',
      reviews: 'ar.reviews',
      score: 'ar.score',
      screenshots: 'avc.screenshots',
      size: 'av.size',
      title: 'avc.title',
      version: 'ar.latest_version_number',
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
        bundle_id: s.detail.appId,
        default_country_id: s.default_country_id.toLowerCase(),
        developer_id: s.detail.developerId,
        is_active: true,
        last_error_message: null,
        last_fetch: s.detail.released,
        released_at: s.detail.released,
      })),
    )
    .onConflict(['application_id'])
    .ignore()

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_releases')
    .insert(
      scraped_apps.map((s) => ({
        application_id: s.application_id,
        country_id: s.country_id.toLowerCase(),
        currency_id: s.detail.currency,
        default_language_id: s.default_language_id.toUpperCase(),
        latest_version_number: s.detail.version,
        price: s.detail.price,
        rating_histogram: Object.values(s.detail.histogram),
        reviews: s.detail.reviews,
        score: s.detail.score,
        store_url: s.detail.url,
      })),
    )
    .onConflict(['application_id', 'country_id'])
    .ignore()

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_versions')
    .insert(
      scraped_apps.map((s) => ({
        application_id: s.application_id,
        content_rating: s.detail.contentRating,
        default_language_id: s.default_language_id.toUpperCase(),
        icon: s.detail.icon,
        language_ids: s.detail.languages.map((l) => l.toUpperCase()),
        released_at: s.detail.updated,
        required_os_version: s.detail.requiredOsVersion,
        size: s.detail.size,
        version_number: s.detail.version,
        website: s.detail.website,
      })),
    )
    .onConflict(['application_id', 'version_number'])
    .ignore()

  await pg
    .queryBuilder()
    .transacting(trx)
    .into('application_version_contents')
    .insert(
      scraped_apps.map((s) => ({
        application_id: s.application_id,
        description: s.detail.description,
        fetched_country_id: s.country_id.toLowerCase(),
        language_id: s.default_language_id.toUpperCase(),
        release_notes: s.detail.releaseNotes,
        screenshots: {
          appletv: s.detail.appletvScreenshots || [],
          default: s.detail.screenshots || [],
          ipad: s.detail.ipadScreenshots || [],
        },
        title: s.detail.title,
        version_number: s.detail.version,
      })),
    )
    .onConflict(['application_id', 'version_number', 'language_id'])
    .ignore()

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
          currency_id: s.detail.currency,
          default_language_id: s.default_language_id,
          latest_version_number: s.detail.version,
          price: s.detail.price,
          rating_histogram: Object.values(s.detail.histogram ?? {}),
          reviews: s.detail.reviews,
          score: s.detail.score,
          store_url: s.detail.url,
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
        application_id: s.application_id,
        content_rating: s.detail.contentRating,
        default_language_id: s.default_language_id,
        icon: s.detail.icon,
        language_ids: s.detail.languages,
        released_at: s.detail.updated,
        required_os_version: s.detail.requiredOsVersion,
        size: s.detail.size,
        version_number: s.detail.version,
        website: s.detail.website,
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
        description: s.detail.description,
        fetched_country_id: s.country_id,
        language_id: s.default_language_id.toUpperCase(),
        release_notes: s.detail.releaseNotes,
        screenshots: {
          appletv: s.detail.appletvScreenshots || [],
          default: s.detail.screenshots || [],
          ipad: s.detail.ipadScreenshots || [],
        },
        title: s.detail.title,
        version_number: s.detail.version,
      })),
    )
    .onConflict(['application_id', 'version_number', 'language_id'])
    .ignore()

  logger.debug('New application version contents created')
  return {}
}
