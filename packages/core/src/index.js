import Sentry from '@sentry/node'
import Tracing from '@sentry/tracing'

import server from './server.js'
import config from './config.js'
import Logger from './logger.js'
import pg from './pg.js'

/// <reference path=”./plugins/index.d.ts” />
const logger = Logger.create().withScope('application')

Sentry.init({
  enabled: config.isProduction,
  dsn: config.sentry,
  integrations: [
    new Sentry.Integrations.OnUncaughtException({
      onFatalError(firstError) {
        Sentry.captureException(firstError)
        logger.withTag('OnUncaughtException').error(firstError)
        process.exit(1)
      },
    }),
    new Sentry.Integrations.OnUnhandledRejection({
      mode: 'strict',
    }),
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Postgres(),
  ],
  tracesSampleRate: 1.0,
})

const start = async () => {
  await pg.raw('select 1+1 as result')
  await server.listen(config.port, '0.0.0.0')
  logger.withTag('start').success(`Application booted on port=${config.port}`)
}
start()
