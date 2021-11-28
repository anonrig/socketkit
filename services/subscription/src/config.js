export default {
  fixerKey: process.env.FIXER_KEY,
  isCI: process.env.NODE_ENV === 'test',
  knex: {
    client: 'pg',
    connection: {
      database: 'subscription',
      user: 'subscription-worker',
    },
    version: '13',
  },
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
}
