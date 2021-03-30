import Sentry from '@sentry/node'
import Tracing from '@sentry/tracing'

import server from './grpc.js'
import config from './config.js'
import { runTasks } from './tasks/index.js'
import Logger from './logger.js'
import pg from './pg.js'

const logger = Logger.create().withScope('application')

Sentry.init({
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
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Postgres(),
  ],
})

const start = async () => {
  server.start(`0.0.0.0:${config.port}`)
  await pg.raw('select 1+1 as result')
  logger.withTag('start').success(`Application booted on port=${config.port}`)
  setImmediate(async () => {
    await runTasks()
  })
}

start()
