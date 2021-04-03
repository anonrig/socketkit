/**
 * @type {Knex.Config}
 */
const config = {
  client: 'pg',
  version: '13',
  connection: {
    database: 'subscription',
    user: 'subscription-worker',
  },
  pool: { min: 2, max: 10 },
  searchPath: ['public'],
  useNullAsDefault: false,
  asyncStackTraces: true,
}
export default config
