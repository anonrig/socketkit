import path from 'path'
import logger from './src/logger.js'

export default {
  client: 'pg',
  version: '13',
  connection: {
    database: 'store',
  },
  pool: { min: 0, max: 5 },
  migrations: {
    tableName: 'migrations',
    directory: path.join(path.resolve(), 'db/migrations'),
  },
  seeds: {
    directory: path.join(path.resolve(), 'db/seeds'),
  },
  log: {
    warn(message) {
      logger.warn(message)
    },
    error(message) {
      logger.error(message)
    },
    deprecate(message) {
      logger.warn(message)
    },
    debug(message) {
      logger.debug(message)
    },
  },
  searchPath: ['public'],
  useNullAsDefault: false,
  asyncStackTraces: true,
}
