import dayjs from 'dayjs'
import pg from '../pg.js'
import scrape from '../requests/app-store.js'
import * as Applications from '../models/applications.js'
import * as Reviews from '../models/reviews.js'

export default function fetchApplications(limit) {
  return pg.transaction(async (trx) => {
    const applications = await pg
      .queryBuilder()
      .transacting(trx)
      .from('applications')
      .where('last_fetch', '<', dayjs().subtract(5, 'minutes'))
      .limit(limit)
      .forUpdate()
      .skipLocked()
      .select(['application_id', 'default_country_id'])

    const scraped_apps = await scrape(applications)

    await Applications.upsert(trx, scraped_apps)

    await Promise.all(
      applications.map((a) =>
        Reviews.create(
          {
            application_id: a.application_id,
            country_id: a.default_country_id,
            page: 1,
          },
          trx,
        ),
      ),
    )

    return applications.length
  })
}
