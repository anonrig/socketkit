const {
  PORT,
  PROXY_HOST,
  PROXY_PORT,
  PROXY_AUTH,
  NODE_ENV,
  SENTRY_DSN,
} = process.env

const isProxyEnabled = !!PROXY_HOST && !!PROXY_PORT && !!PROXY_AUTH

export default {
  isProduction: NODE_ENV === 'production',
  port: PORT ? parseInt(PORT) : 3003,
  sentry_dsn: SENTRY_DSN,
  isProxyEnabled,
  proxy: isProxyEnabled
    ? {
        host: PROXY_HOST,
        port: parseInt(PROXY_PORT, 10),
        proxyAuth: PROXY_AUTH,
      }
    : null,
  reviews_fetch_interval: 15, // minutes
  reviews_batch_size: 10,
  applications_fetch_interval: 1, // hour
  applications_batch_size: 1,
  knex: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'store',
      user: 'store-worker',
      port: 5432,
    },
    pool: { min: 0, max: 5 },
  },
}
