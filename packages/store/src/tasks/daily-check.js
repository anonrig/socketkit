import pg from '../pg.js'
import { storeQueue } from '../redis.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('tasks').withTag('daily-check')
export async function dailyCheck() {
  logger.success('Processed daily event')

  const applications = await pg
    .queryBuilder()
    .select(['application_id'])
    .from('applications')

  logger.info(
    `Creating ${applications.length} number of application fetch task.`,
  )

  await storeQueue.addBulk(
    applications.map((application) => ({
      name: 'process-application',
      data: {
        application_id: application.application_id,
        country_id: 'us',
      },
    })),
  )
}
