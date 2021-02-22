import dd from 'dd-trace'
dd.init({
  url: 'http://datadog-cluster-agent.datadog.svc.cluster.local:5005',
  logLevel: 'error',
})
import './tracer.js'
import Logger from './logger.js'
import config from './config.js'
import listenEvents from './listener.js'
import pg from './pg.js'
import app from './grpc.js'

const logger = Logger.create().withScope('application')

process.on('uncaughtException', (err) => {
  logger.fatal(err)
  process.exit(1)
})

const boot = async () => {
  try {
    await pg.raw('select 1+1 as result')
    app.start(`0.0.0.0:${config.port}`)
    await listenEvents()
    logger.info(`server listening on 0.0.0.0:${config.port}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}
boot()
