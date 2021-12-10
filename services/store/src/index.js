import config from './config.js'
import { build } from './grpc.js'
import logger from './logger.js'
import pg from './pg.js'
import { runTasks } from './tasks/index.js'

const server = build()

await server.start(`0.0.0.0:${config.port}`)
await pg.raw('select 1+1 as result')

logger.info(`Application booted on port=${config.port}`)

await runTasks()
logger.info(`Application started running tasks`)
