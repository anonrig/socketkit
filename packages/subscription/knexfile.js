import path from 'path'
import Knex from 'knex'

/**
 * @type {Knex.Config}
 */
const config = {
  client: 'pg',
  version: '13',
  connection: {
    database: 'subscription',
    user: 'subscription-worker',
    port: 5432,
  },
  pool: { min: 0, max: 5 },
  migrations: {
    tableName: 'migrations',
    directory: path.join(path.resolve(), 'db/migrations'),
  },
  seeds: {
    directory: path.join(path.resolve(), 'db/seeds'),
  },
  searchPath: ['public'],
  useNullAsDefault: false,
  asyncStackTraces: true,
}
export default config
