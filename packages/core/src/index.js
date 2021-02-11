import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import server from './server.js'
import config from './config.js'
import { runTasks } from './tasks/index.js'
import Logger from './logger.js'
import pg from './pg.js'

/// <reference path=”./plugins/index.d.ts” />

const start = async () => {
  const logger = Logger.create().withScope('application').withTag('start')
  try {
    logger.info(`application booted`)

    await pg.raw('select 1+1 as result')

    Sentry.init({
      dsn: config.sentry.dsn,
      maxBreadcrumbs: 50,
      attachStacktrace: true,
      environment: config.isProduction ? 'production' : 'development',
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({
          app: server,
        }),
        new Tracing.Integrations.Postgres(),
      ],
    })

    await server.listen(config.port, '0.0.0.0')
    await runTasks()
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}
start()
