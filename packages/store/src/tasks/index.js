import { storeQueue } from '../redis.js'
import dailyCheck from './daily-check.js'
import f from '../server.js'

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

  storeQueue.on('active', () => f.log.info(`Redis queue active`))
  storeQueue.on('error', (error) => f.log.error(error))
  storeQueue.on('failed', (error) => f.log.error(error))
  storeQueue.on('completed', (job, result) => {
    f.log.info(`Redis job completed ${job.id} with result ${result}`)
  })
}
