export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3002,
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
}
