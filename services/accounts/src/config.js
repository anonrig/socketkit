export default {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3006,
  knex: {
    client: 'pg',
    version: '13',
    connection: {
      database: process.env.PGDATABASE || 'accounts',
      user: process.env.PGUSER || 'accounts-worker',
    },
    migrations: {
      directory: './migrations',
      loadExtensions: ['.js'],
      tableName: 'migrations',
    },
  },
  grpc_options: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
}
