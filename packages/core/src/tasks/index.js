import { coreQueue } from '../redis.js'
import dailyIntegrations from './daily-integrations.js'
import f from '../server.js'

export async function runTasks() {
  await coreQueue.add(
    'fetch-integrations',
    {},
    {
      repeat: {
        cron: '0 6 * * *',
        tz: 'America/Los_Angeles',
      },
      jobId: 'fetch-integrations',
    },
  )

  coreQueue.process('fetch-integrations', async () => {
    await dailyIntegrations()
  })

  coreQueue.on('active', () => f.log.info(`Redis queue active`))
  coreQueue.on('error', (error) => f.log.error(error))
  coreQueue.on('failed', (error) => f.log.error(error))
  coreQueue.on('completed', (job, result) => {
    f.log.info(`Redis job completed ${job.id} with result ${result}`)
  })
}
