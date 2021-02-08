export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  postgresql: process.env.DATABASE_URL,
  grpc: {
    appstore: process.env.APPSTORE_GRPC_URL,
    store: process.env.STORE_GRPC_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  sentry: {
    dsn: 'https://57f40278635342e89eae2072e85624a6@o501595.ingest.sentry.io/5628037'
  }
}
