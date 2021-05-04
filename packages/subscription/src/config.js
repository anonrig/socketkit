export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  fixerKey: process.env.FIXER_KEY,
  sentry_dsn: process.env.SENTRY_DSN,
  knex: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'subscription',
      user: 'subscription-worker',
    },
    pool: { min: 2, max: 10 },
  },
}
