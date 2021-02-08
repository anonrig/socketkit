import fetchApplications from './appstore-fetcher.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('tasks')
const limit = 10
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function runTasks() {
  if (process.env.NODE_ENV === 'test') {
    return
  }
  
  logger.info('Searching for 10 applications to process')
  const processed = await fetchApplications(limit)
  logger.success(`Processed ${processed} applications`)
  if (processed < 10) {
    logger.info('Sleeping for 10 minutes')
    await sleep(600000)
  }
  await runTasks()
}
