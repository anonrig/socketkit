import Sentry from '@sentry/node'
import Tracing from '@sentry/tracing'
import config from './config.js'
import Logger from './logger.js'
import pg from './pg.js'
import build from './server.js'

/// <reference path=”./plugins/index.d.ts” />
const logger = Logger.create().withScope('application')

Sentry.init({
  dsn: config.sentry_dsn,
  tracesSampleRate: 1.0,
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
    new Tracing.Integrations.Postgres(),
  ],
})

const start = async () => {
  const server = await build()
  await pg.raw('select 1+1 as result')
  await server.listen(config.port, '0.0.0.0')
  logger.withTag('start').success(`Application booted on port=${config.port}`)
}
start()
