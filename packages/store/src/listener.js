import { storeQueue } from './redis.js'
import Logger from './logger.js'
import { createApplication } from './consumers/application/create.js'

const logger = Logger.create().withScope('listeners')

export async function listenEvents() {
  storeQueue.process('create-application', async (job) => {
    logger.success(`Received event=create-application`)
    createApplication(job.data)
  })

  storeQueue.process('process-application', async (job) => {
    logger.success(`Received event=process-application`)
    processApplication(job.data)
  })
}
