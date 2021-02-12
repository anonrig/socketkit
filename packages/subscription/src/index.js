import server, { grpc } from './grpc.js'
// import * as Sentry from '@sentry/node'
// import * as Tracing from '@sentry/tracing'
import Logger from './logger.js'
import config from './config.js'
import listenEvents from './listener.js'
import pg from './pg.js'

const logger = Logger.create().withScope('application')

process.on('uncaughtException', (err) => {
  logger.fatal(err)
  process.exit(1)
})

const boot = async () => {
  try {
    await pg.raw('select 1+1 as result')

    // Sentry.init({
    //   dsn: config.sentry.dsn,
    //   maxBreadcrumbs: 50,
    //   attachStacktrace: true,
    //   environment: config.isProduction ? 'production' : 'development',
    //   integrations: [new Tracing.Integrations.Postgres()],
    // })

    server.bindAsync(
      `0.0.0.0:${config.port}`,
      grpc.ServerCredentials.createInsecure(),
      () => server.start(),
    )

    await listenEvents()

    logger.info(`server listening on 0.0.0.0:${config.port}`)
  } catch (err) {
    logger.error(err)
    // Sentry.captureException(err)
    process.exit(1)
  }
}
boot()
