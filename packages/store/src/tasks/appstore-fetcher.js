import dayjs from 'dayjs'
import createApplication from '../methods/create-application.js'
import pg from '../pg.js'

export default function fetchApplications(limit) {
  return pg.transaction(async (trx) => {
    const applications = await pg
      .select('application_id')
      .from('applications')
      .where('last_fetch', '<', dayjs().subtract(6, 'second'))
      .limit(limit)
      .forUpdate()
      .skipLocked()
      .transacting(trx)

    await Promise.all(
      applications.map(({ application_id }) =>
        createApplication({ application_id, country_id: 'us' }, trx),
      ),
    )

    return applications.length
  })
}
