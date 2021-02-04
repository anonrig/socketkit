import { createTerminus } from '@godaddy/terminus'
import pg from './pg.js'
import Logger from './logger.js'

const logger = Logger.create().withScope('health')

export default function create(f) {
  createTerminus(f.server, {
    healthChecks: {
      '/health': async function health() {
        await pg.raw('select 1+1 as result')
      },
      verbatim: true,
    },
    logger: (message, error) => {
      logger.fatal(message)
      logger.warn(error)
    },
  })
}
