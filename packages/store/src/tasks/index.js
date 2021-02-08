import fetchApplications from './appstore-fetcher.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('tasks')
const limit = 10

export async function runTasks() {
  logger.info('Searching for 10 applications to process')
  const processed = await fetchApplications(limit)
  logger.success(`Processed ${processed} applications`)
  if (processed < 10) {
    logger.info('Sleeping for 10 minutes')
    await sleep(600000)
  }
  await runTasks()
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
