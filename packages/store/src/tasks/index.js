import fetchAnApplication from './appstore-fetcher.js'
import Logger from '../logger.js'

const logger = Logger.create()
const limit = 10

export async function runTasks() {
  logger.info('Searching for 10 applications to process')
  var processed = await fetchAnApplication(10)
  logger.info(`Processed ${processed} appliations`)
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
