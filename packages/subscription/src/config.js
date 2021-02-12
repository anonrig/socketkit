export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  fixerKey: process.env.FIXER_KEY,
  redis: {
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
  },
  sentry: {
    dsn:
      'https://dc5db1fbaed34b799ce3ce9d36e95a35@o501595.ingest.sentry.io/5582918',
  },
  grpc: {
    store: process.env.STORE_GRPC_URL,
  },
}
