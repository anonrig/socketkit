import { storeQueue } from '../redis.js'
import dailyCheck from './daily-check.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('redis')

export async function runTasks() {
  await storeQueue.add(
    'daily-fetch',
    {},
    {
      repeat: {
        cron: '0 6 * * *',
        tz: 'America/Los_Angeles',
      },
      jobId: 'daily-fetch',
    },
  )

  storeQueue.process('daily-fetch', async () => {
    await dailyCheck()
  })

  storeQueue.on('active', () => logger.success(`Redis queue active`))
  storeQueue.on('error', (error) => logger.error(error))
  storeQueue.on('failed', (error) => logger.warn(error))
  storeQueue.on('completed', (job, result) => {
    logger.info(`Redis job completed ${job.id} with result ${result}`)
  })
}
