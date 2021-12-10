/* c8 ignore start */
import { PerformanceObserver, performance } from 'perf_hooks'

import logger from './logger.js'

const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    logger.info(`${entry.name} took ${entry.duration.toFixed(2)} ms`)
  })
})
performanceObserver.observe({ buffered: true, entryTypes: ['measure'] })

export function measure(context) {
  performance.mark(`${context.fullName}-ended`)
  performance.measure(context.fullName, context.fullName, `${context.fullName}-ended`)
}

export default async function GrpcPerformance(context, next) {
  const isHealthRequest = context.fullName.includes('grpc.health')

  if (isHealthRequest) {
    return next()
  }

  performance.mark(context.fullName)

  return next()
    .then(() => measure(context))
    .catch((error) => {
      measure(context)
      throw error
    })
}
