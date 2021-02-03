import server from './server.js'
import config from './config.js'
import pg from './pg.js'

/// <reference path=”./plugins/index.d.ts” />

const start = async () => {
  try {
    await pg.raw('select 1+1 as result')
    await server.listen(config.port, '0.0.0.0')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
