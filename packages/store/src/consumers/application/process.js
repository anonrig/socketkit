import dayjs from 'dayjs'
import store from 'app-store-scraper'

export async function processApplication(trx, application_id, country_id) {
  const data = await store.app({ id: application_id, ratings: true })

  if (!data) {
    throw new Error(`Application not found`)
  }

  const applications = await trx('applications')
    .where('application_id', application_id)
    .update('last_fetch', dayjs())
    .returning('application_id')

  if (applications.length == 0) {
    throw new Error(
      `Application with id=${application_id} not found on existing db.`,
    )
  }

  await trx('application_versions')
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
    .onConflict(['application_id', 'country_id', 'version'])
    .ignore()

  await trx('application_ratings')
    .insert({
      application_id: data.id,
      country_id,
      rating_histogram: Object.values(data.histogram),
    })
    .onConflict(['application_id', 'country_id'])
    .merge()
}
