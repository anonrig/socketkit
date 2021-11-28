export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  fixerKey: process.env.FIXER_KEY,
  isCI: process.env.NODE_ENV === 'test',
  knex: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'subscription',
      user: 'subscription-worker',
    },
  },
}
