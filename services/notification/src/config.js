export default {
  grpc_options: {
    defaults: true,
    enums: String,
    keepCase: true,
    longs: String,
    oneofs: true,
  },
  isCI: process.env.NODE_ENV === 'test',
  isProduction: process.env.NODE_ENV === 'production',
  knex: {
    client: 'pg',
    connection: {
      database: process.env.PGDATABASE || 'notification',
      user: process.env.PGUSER || 'notification-worker',
    },
    migrations: {
      directory: './migrations',
      loadExtensions: ['.js'],
      tableName: 'migrations',
    },
    version: '13',
  },
  port: process.env.PORT ? parseInt(process.env.PORT) : 3004,
  sendgrid_api_key: process.env.SENDGRID_API_KEY,
}
