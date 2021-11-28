import path from 'path'

import { PerformanceObserver, performance } from 'perf_hooks'

import Mali from 'mali'

import config from './config.js'
import * as Applications from './consumers/index.js'
import * as Integrations from './consumers/integrations.js'
import * as Reviews from './consumers/reviews.js'
import Logger from './logger.js'

const logger = Logger.create().withScope('grpc')
const file = path.join(path.resolve(''), 'protofiles/store.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    logger.withTag('performance').info(`${entry.name} took ${entry.duration.toFixed(2)} ms`)
  })
})
performanceObserver.observe({ buffered: true, entryTypes: ['measure'] })

export function build() {
  const app = new Mali()

  app.addService(file, 'Reviews', config.grpc_options)
  app.addService(file, 'Applications', config.grpc_options)
  app.addService(file, 'Integrations', config.grpc_options)
  app.addService(health, 'Health', config.grpc_options)

  app.use(async (context, next) => {
    if (config.isCI || config.isProd) {
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

  app.use({ Applications, Integrations, Reviews })
  app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

  app.on('error', (error) => {
    if (!error.code) {
      logger.fatal(error)
    }
  })

  return app
}
