export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  fixerKey: process.env.FIXER_KEY,
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  sentry: {
    dsn:
      'https://dc5db1fbaed34b799ce3ce9d36e95a35@o501595.ingest.sentry.io/5582918',
  },
  grpc: {
    store: process.env.STORE_GRPC_URL,
  },
}
