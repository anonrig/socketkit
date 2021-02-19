import dayjs from 'dayjs'
import * as Applications from '../models/application.js'
import * as Reviews from '../models/reviews.js'
import pg from '../pg.js'
import scraper from 'app-store-scraper'

export default function fetchApplications(limit) {
  return pg.transaction(async (trx) => {
    const applications = await pg
      .select('application_id')
      .from('applications')
      .where('last_fetch', '<', dayjs().subtract(5, 'minutes'))
      .limit(limit)
      .forUpdate()
      .skipLocked()
      .transacting(trx)

    const scraped_apps = await Promise.all(
      applications.map(({ application_id }) =>
        scraper.app({ id: application_id, ratings: true }),
      ),
    )

    await Applications.upsertVersion(scraped_apps, 'us', trx)

    return applications.length
  })
}
