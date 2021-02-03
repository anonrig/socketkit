import { appstoreQueue } from './redis.js'
import onProcessDate from './consumers/integration/on-process-date.js'
import Logger from './logger.js'

const logger = Logger.create().withScope('listeners')
export default async function listenEvents() {
  appstoreQueue.process('process-date', 10, async (job) => {
    logger.success(`Received event=process-date`)
    await onProcessDate(job.data)
  })
}
