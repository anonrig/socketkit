import path from 'path'
import Mali from 'mali'
import Sentry from '@sentry/node'
import { PerformanceObserver, performance } from 'perf_hooks'

import Logger from './logger.js'
import * as Applications from './consumers/index.js'
import * as Integrations from './consumers/integrations.js'
import * as Reviews from './consumers/reviews.js'

const logger = Logger.create().withScope('grpc')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const file = path.join(path.resolve(''), 'protofiles/store.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    logger
      .withTag('performance')
      .info(`${entry.name} took ${entry.duration.toFixed(2)} ms`)
  })
})
performanceObserver.observe({ entryTypes: ['measure'], buffered: true })

const app = new Mali()

app.addService(file, 'Reviews', options)
app.addService(file, 'Applications', options)
app.addService(file, 'Integrations', options)

app.addService(health, 'Health', options)

app.use(async (context, next) => {
  let tracer = null

  if (!context.fullName.includes('health')) {
    tracer = Sentry.startTransaction({
      name: context.fullName,
      op: 'GET',
      trimEnd: true,
    })

    Sentry.setUser({
      ...context.request.metadata,
      account_id: context.request.req.account_id,
    })
  }
  performance.mark(context.fullName)
  return next()
    .then(() => {
      tracer?.finish()
      performance.mark(context.fullName + '-ended')
      performance.measure(
        context.fullName,
        context.fullName,
        context.fullName + '-ended',
      )
    })
    .catch((error) => {
      Sentry.captureException(error)
      logger.fatal(error)
      tracer?.finish()
      performance.mark(context.fullName + '-ended')
      performance.measure(
        context.fullName,
        context.fullName,
        context.fullName + '-ended',
      )
      throw error
    })
})

app.use({ Applications, Integrations, Reviews })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (error) => {
  if (!error.code) {
    Sentry.captureException(error)
    logger.fatal(error)
  }
})

export default app
