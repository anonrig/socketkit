import dayjs from 'dayjs'
import * as Applications from '../models/application.js'
import * as Reviews from '../models/reviews.js'
import pg from '../pg.js'

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
      applications.map(({ application_id }) =>
        Applications.create({ application_id, country_id: 'us' }, trx)
          .then(() =>
            Applications.update(
              { application_id },
              { last_fetch: dayjs() },
              trx,
            ),
          )
          .then(() =>
            Reviews.create({ application_id, country_id: 'us' }, trx),
          ),
      ),
    )

    return applications.length
  })
}
