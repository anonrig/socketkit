const { PORT, PROXY_HOST, PROXY_PORT, PROXY_AUTH, NODE_ENV } = process.env

const isProxyEnabled = !!PROXY_HOST && !!PROXY_PORT && !!PROXY_AUTH

export default {
  applications_batch_size: 1,
  applications_fetch_interval: 1,
  grpc_options: {
    defaults: true,
    enums: String,
    keepCase: true,
    longs: String,
    oneofs: true,
  },
  isCI: process.env.NODE_ENV === 'test',
  isProduction: NODE_ENV === 'production',
  isProxyEnabled,
  knex: {
    client: 'pg',
    connection: {
      database: 'store',
      port: 5432,
      user: 'store-worker',
    },
    version: '13',
  },
  port: PORT ? parseInt(PORT) : 3003,
  proxy: isProxyEnabled
    ? {
        host: PROXY_HOST,
        port: parseInt(PROXY_PORT, 10),
        proxyAuth: PROXY_AUTH,
      }
    : null,
  reviews_batch_size: 10,
  reviews_fetch_interval: 15,
}
