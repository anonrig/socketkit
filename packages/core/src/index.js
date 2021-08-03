import config from './config.js'
import Logger from './logger.js'
import pg from './pg.js'
import build from './server.js'

/// <reference path=”./plugins/index.d.ts” />
const logger = Logger.create({}).withScope('application')

const start = async () => {
  const server = await build()
  await pg.raw('select 1+1 as result')
  await server.listen(config.port, '0.0.0.0')
  logger.withTag('start').success(`Application booted on port=${config.port}`)
}

start().catch((error) => logger.fatal(error))
