import fetchApplications from './applications-fetcher.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('tasks')
const limit = 10
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function runTasks() {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  try {
    logger.info(`Searching for ${limit} applications to process`)
    const processed = await fetchApplications(limit)
    logger.success(`Processed ${processed} applications`)
    if (processed < limit) {
      logger.info('Sleeping for 5 minutes')
      await sleep(600000)
    }
  } catch (error) {
    logger.error(error)
    await sleep(60000)
  }

  await runTasks()
}
