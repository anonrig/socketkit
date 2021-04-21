export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  fixerKey: process.env.FIXER_KEY,
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
