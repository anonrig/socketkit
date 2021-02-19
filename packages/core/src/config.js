export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  postgresql: process.env.DATABASE_URL,
  grpc: {
    subscription: process.env.SUBSCRIPTION_GRPC_URL ?? 'localhost:3001',
    store: process.env.STORE_GRPC_URL ?? 'localhost:3003',
  },
  redis: {
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
  },
}
