import { appstoreQueue } from './redis.js'
import onProcessDate from './consumers/integration/on-process-date.js'
import Logger from './logger.js'
import pg from './pg.js'

export default async function listenEvents() {
  appstoreQueue.process('process-date', 10, async (job) => {
    await pg.transaction(async (trx) => await onProcessDate(job.data, trx))
  })
}
