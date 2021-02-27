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
      .from('applications AS a')
      .join('application_releases AS ar', function () {
        this.on('a.application_id', 'ar.application_id').andOn(
          'a.default_country_id',
          'ar.country_id',
        )
      })
      .where('a.last_fetch', '<', dayjs().subtract(5, 'minutes'))
      .limit(limit)
      .forUpdate()
      .skipLocked()
      .select([
        'a.application_id',
        'a.default_country_id',
        'ar.default_language_id',
      ])

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
