import dayjs from 'dayjs'
import pg from '../pg.js'
import { processApplication } from '../consumers/application/process.js'

export default function fetchApplications(limit) {
  return pg.transaction(async trx => {
    const applications = await trx('applications')
      .where('last_fetch', '<', dayjs().subtract(6, 'second'))
      .limit(limit)
      .forUpdate()
      .skipLocked()
      .select('application_id')

    await Promise.all(applications.map(({ application_id }) => processApplication(trx, application_id, 'us')))

    return applications.length
  })
}
