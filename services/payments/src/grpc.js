import path from 'path'
import Mali from 'mali'
import { PerformanceObserver, performance } from 'perf_hooks'

import Logger from './logger.js'
import * as Integrations from './consumers/integrations.js'
import * as Payments from './consumers/payments.js'

const logger = Logger.create().withScope('grpc')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const file = path.join(path.resolve(''), 'protofiles/payment.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')

if (process.env.NODE_ENV !== 'test') {
  const performanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      logger
        .withTag('performance')
        .info(`${entry.name} took ${entry.duration.toFixed(2)} ms`)
    })
  })
  performanceObserver.observe({ entryTypes: ['measure'], buffered: true })
}

const app = new Mali()

app.addService(file, 'Payments', options)
app.addService(file, 'Integrations', options)
app.addService(health, 'Health', options)

app.use(async (context, next) => {
  performance.mark(context.fullName)

  return next()
    .then(() => {
      performance.mark(context.fullName + '-ended')
      performance.measure(
        context.fullName,
        context.fullName,
        context.fullName + '-ended',
      )
    })
    .catch((error) => {
      logger.fatal(error)
      performance.mark(context.fullName + '-ended')
      performance.measure(
        context.fullName,
        context.fullName,
        context.fullName + '-ended',
      )
      throw error
    })
})

app.use({ Payments, Integrations })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (error) => {
  if (!error.code) {
    logger.fatal(error)
  }
})

export default app
