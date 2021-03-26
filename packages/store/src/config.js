export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3003,
  proxy: !!process.env.PROXY_HOST
    ? {
        host: process.env.PROXY_HOST,
        port: process.env.PROXY_PORT,
        proxyAuth: process.env.PROXY_AUTH,
      }
    : null,
}
