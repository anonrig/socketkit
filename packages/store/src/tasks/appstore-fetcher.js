import dayjs from 'dayjs'
import pg from '../pg.js'
import { processApplication } from '../consumers/application/process.js'

export default async function fetchApplications(limit) {
  return await pg.transaction(async trx => {
    const applications = await trx('applications')
      .where('last_fetch', '<', dayjs().subtract(6, 'second'))
      .limit(limit)
      .forUpdate()
      .skipLocked()
      .select('application_id')

    await Promise.all(applications.map(async application => {
      await processApplication(trx, application.application_id, 'us')
    }))

    return applications.length
  })
}
