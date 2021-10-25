import Logger from './logger.js'
import config from './config.js'
import { runTasks } from './tasks/index.js'
import pg from './pg/index.js'
import app from './grpc.js'

const logger = Logger.create().withScope('application')

await app.start(`0.0.0.0:${config.port}`)
await pg.raw('select 1+1 as result')
logger.info(`server listening on 0.0.0.0:${config.port}`)
await runTasks()
