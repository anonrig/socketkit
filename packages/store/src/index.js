import server, { grpc } from './grpc.js'

import config from './config.js'
import { runTasks } from './tasks/index.js'
import Logger from './logger.js'
import pg from './pg.js'

const start = async () => {
  const logger = Logger.create().withScope('application').withTag('start')
  try {
    await pg.raw('select 1+1 as result')

    server.bindAsync(
      `0.0.0.0:${config.port}`,
      grpc.ServerCredentials.createInsecure(),
      () => server.start(),
    )

    await runTasks()

    logger.success(`Application booted on port=${config.port}`)
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}

start()
