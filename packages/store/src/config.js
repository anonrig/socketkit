const { PORT, PROXY_HOST, PROXY_PORT, PROXY_AUTH, NODE_ENV } = process.env

const isProxyEnabled = !!PROXY_HOST && !!PROXY_PORT && !!PROXY_AUTH

export default {
  isProduction: NODE_ENV === 'production',
  port: PORT ? parseInt(PORT) : 3003,
  isProxyEnabled,
  proxy: isProxyEnabled
    ? {
        host: PROXY_HOST,
        port: parseInt(PROXY_PORT),
        proxyAuth: PROXY_AUTH,
      }
    : null,
}
