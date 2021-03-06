export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  grpc: {
    subscription: process.env.SUBSCRIPTION_GRPC_URL ?? 'localhost:3001',
    store: process.env.STORE_GRPC_URL ?? 'localhost:3003',
  },
  sentry: process.env.SENTRY_DSN,
}
