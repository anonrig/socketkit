import pg from '../pg.js'
import store from 'app-store-scraper'
import Logger from '../logger.js'

export default async function createApplication(
  { application_id, country_id },
  trx,
) {
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
