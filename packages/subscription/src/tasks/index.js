import appStoreConnectFetcher from './app-store-connect-fetcher.js'
import deleteIntegrations from './delete-integrations.js'
import Logger from '../logger.js'
import { setTimeout } from 'timers/promises'

const logger = Logger.create().withScope('tasks')

export async function runTasks() {
  if (process.env.NODE_ENV === 'test') {
    return
  }
  try {
    const processed = await Promise.all([
      appStoreConnectFetcher(),
      deleteIntegrations(),
    ])

    if (processed.every((s) => !s)) {
      logger.withTag('runTasks').info('Sleeping for 10 minutes')
      await setTimeout(600000)
    }
  } catch (error) {
    logger.error(error)
    await setTimeout(60000)
  }

  await runTasks()
}
