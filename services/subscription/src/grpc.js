import path from 'path'
import { PerformanceObserver, performance } from 'perf_hooks'

import Mali from 'mali'

import config from './config.js'

import * as Integrations from './consumers/integration/index.js'
import * as Reports from './consumers/reports/index.js'
import * as Subscribers from './consumers/subscriber/index.js'
import * as Subscriptions from './consumers/subscription/index.js'
import * as Transactions from './consumers/transaction/index.js'
import Logger from './logger.js'

const logger = Logger.create().withScope('grpc')
const options = {
  defaults: true,
  enums: String,
  keepCase: true,
  longs: String,
  oneofs: true,
}
const file = path.join(path.resolve(''), 'protofiles/subscription.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    logger.withTag('performance').info(`${entry.name} took ${entry.duration.toFixed(2)} ms`)
  })
})
performanceObserver.observe({ buffered: true, entryTypes: ['measure'] })

const app = new Mali()

app.addService(
  file,
  ['Subscribers', 'Subscriptions', 'Transactions', 'Integrations', 'Reports'],
  options,
)
app.addService(health, 'Health', options)

app.use(async (context, next) => {
  const isHealthRequest = context.fullName.includes('grpc.health')

  if (isHealthRequest || config.isCI) {
    return next()
  }

  performance.mark(context.fullName)

  return next()
    .then(() => {
      performance.mark(context.fullName + '-ended')
      performance.measure(context.fullName, context.fullName, context.fullName + '-ended')
    })
    .catch((error) => {
      logger.fatal(error)
      performance.mark(context.fullName + '-ended')
      performance.measure(context.fullName, context.fullName, context.fullName + '-ended')
      throw error
    })
})

app.use({
  Integrations,
  Reports,
  Subscribers,
  Subscriptions,
  Transactions,
})
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (error) => {
  if (!error.code) {
    logger.fatal(error)
  }
})

export default app
