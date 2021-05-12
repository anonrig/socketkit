import { setTimeout } from 'timers/promises'
import appStoreConnectFetcher from './app-store-connect-fetcher.js'
import deleteIntegrations from './delete-integrations.js'
import Logger from '../logger.js'

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
      await setTimeout(600000)
    }
  } catch (error) {
    logger.fatal(error)
    await setTimeout(60000)
  }

  await runTasks()
}
