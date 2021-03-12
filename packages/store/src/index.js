import Sentry from '@sentry/node'
import Tracing from '@sentry/tracing'

import server from './grpc.js'
import config from './config.js'
import { runTasks } from './tasks/index.js'
import Logger from './logger.js'
import pg from './pg.js'

const logger = Logger.create().withScope('application')

Sentry.init({
  enabled: config.isProduction,
  dsn:
    'https://fcad5b1439154498a65fc40c80df79f3@o482381.ingest.sentry.io/5662869',
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
    new Sentry.Integrations.Http(),
    new Tracing.Integrations.Postgres(),
  ],
})

const start = async () => {
  await pg.raw('select 1+1 as result')
  server.start(`0.0.0.0:${config.port}`)
  logger.withTag('start').success(`Application booted on port=${config.port}`)
  await runTasks()
}

start()
