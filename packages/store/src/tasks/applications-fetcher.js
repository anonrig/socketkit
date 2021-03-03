import dayjs from 'dayjs'
import pg from '../pg.js'
import * as AppStore from '../requests/app-store.js'
import * as Applications from '../models/applications.js'
import * as Reviews from '../models/reviews.js'

export default function fetchApplications(limit) {
  return pg.transaction(async (trx) => {
    const applications = await pg
      .queryBuilder()
      .select([
        'a.application_id',
        'a.default_country_id',
        'ar.default_language_id',
      ])
      .from('applications AS a')
      .limit(limit)
      .join('application_releases AS ar', function () {
        this.on('a.application_id', 'ar.application_id').andOn(
          'a.default_country_id',
          'ar.country_id',
        )
      })
      .where('a.last_fetch', '<', dayjs().subtract(10, 'minutes'))
      .forUpdate()
      .skipLocked()
      .transacting(trx)

    // const scraped_apps = await AppStore.scrapeAll(applications)

    // await Applications.upsert(scraped_apps, trx)

    // await Promise.all(
    //   applications.map((a) =>
    //     Reviews.create(
    //       {
    //         application_id: a.application_id,
    //         country_id: a.default_country_id,
    //         page: 1,
    //       },
    //       trx,
    //     ),
    //   ),
    // )

    return applications.length
  })
}
