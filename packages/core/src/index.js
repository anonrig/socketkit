import server from './server.js'
import config from './config.js'
import { runTasks } from './tasks/index.js'
import Logger from './logger.js'
import pg from './pg.js'

/// <reference path=”./plugins/index.d.ts” />

const start = async () => {
  const logger = Logger.create().withScope('application').withTag('start')
  try {
    logger.info(`application booted`)
    await pg.raw('select 1+1 as result')
    await server.listen(config.port, '0.0.0.0')
    await runTasks()
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}
start()
