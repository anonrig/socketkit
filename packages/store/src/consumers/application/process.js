import pg from '../../pg.js'
import store from 'app-store-scraper'
import { createDeveloper } from '../../methods/create-developer.js'

export async function processApplication({ application_id, country_id }) {
  const data = await store.app({ id: application_id, ratings: true })

  if (!data) {
    throw new Error(`Application not found`)
  }

  const application = await pg
    .queryBuilder()
    .select('*')
    .from('applications')
    .where({ application_id })
    .first()

  if (!application) {
    throw new Error(
      `Application with id=${application_id} not found on existing db.`,
    )
  }

  // create application version if not exists
  await pg
    .queryBuilder()
    .insert({
      score: data.score,
      reviews: data.reviews,
      released_at: data.released,
      updated_at: data.updated,
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
    .returning('*')

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
}
