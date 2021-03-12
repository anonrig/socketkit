import Sentry from '@sentry/node'
import Tracing from '@sentry/tracing'

import Logger from './logger.js'
import config from './config.js'
import { runTasks } from './tasks/index.js'
import pg from './pg.js'
import app from './grpc.js'

const logger = Logger.create().withScope('application')

Sentry.init({
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.OnUncaughtException({
      onFatalError(firstError) {
        logger.error(firstError)
        Sentry.captureException(firstError)
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

const boot = async () => {
  app.start(`0.0.0.0:${config.port}`)
  await pg.raw('select 1+1 as result')
  logger.info(`server listening on 0.0.0.0:${config.port}`)
  await runTasks()
}
boot()
