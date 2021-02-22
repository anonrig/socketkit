import { appstoreQueue } from './redis.js'
import onProcessDate from './consumers/integration/on-process-date.js'
import pg from './pg.js'

export default async function listenEvents() {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  appstoreQueue.process('process-date', 5, async (job) => {
    await pg.transaction(async (trx) => await onProcessDate(job.data, trx))
  })
}
