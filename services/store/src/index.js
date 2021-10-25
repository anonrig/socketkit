import { build } from './grpc.js'
import config from './config.js'
import { runTasks } from './tasks/index.js'
import Logger from './logger.js'
import pg from './pg.js'

const logger = Logger.create().withScope('application')
const server = build()

await server.start(`0.0.0.0:${config.port}`)
await pg.raw('select 1+1 as result')
logger.withTag('start').success(`Application booted on port=${config.port}`)
setImmediate(async () => {
  await runTasks()
})
