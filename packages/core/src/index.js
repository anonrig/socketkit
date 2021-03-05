import Sentry from '@sentry/node'
import Tracing from '@sentry/tracing'

import server from './server.js'
import config from './config.js'
import Logger from './logger.js'
import pg from './pg.js'

/// <reference path=”./plugins/index.d.ts” />
const logger = Logger.create().withScope('application').withTag('start')

Sentry.init({
  dsn:
    'https://ef07b3cbc6d442399a62a7813df27920@o482381.ingest.sentry.io/5662728',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Postgres(),
  ],
  tracesSampleRate: 1.0,
})

const start = async () => {
  try {
    logger.info(`application booted`)
    await pg.raw('select 1+1 as result')
    await server.listen(config.port, '0.0.0.0')
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}
start()
