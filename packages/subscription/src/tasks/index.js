import appStoreConnectFetcher from './app-store-connect-fetcher.js'
import deleteIntegrations from './delete-integrations.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('tasks')
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function runTasks() {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  const processed = await Promise.all([
    appStoreConnectFetcher(),
    deleteIntegrations(),
  ])

  if (processed.every((s) => !s)) {
    logger.info('Sleeping for 10 minutes')
    await sleep(600000)
  }
  await runTasks()
}
