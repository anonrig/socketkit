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

    await Promise.all(
      applications.map(
        async ({ application_id }) =>
          await Applications.upsertVersion(
            await scraper.app({ id: application_id, ratings: true }),
            'us',
            trx,
          ).then(() =>
            Reviews.create({ application_id, country_id: 'us' }, trx),
          ),
      ),
    )

    return applications.length
  })
}
