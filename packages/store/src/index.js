import server from './server.js'
import config from './config.js'

/// <reference path=”./plugins/index.d.ts” />

const start = async () => {
  try {
    await server.listen(config.port, '0.0.0.0')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
