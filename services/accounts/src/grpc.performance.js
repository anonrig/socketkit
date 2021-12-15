import { PerformanceObserver, performance } from 'perf_hooks'

import Logger from './logger.js'

const logger = Logger.create({}).withScope('grpc')
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    logger
      .withTag('performance')
      .info(`${entry.name} took ${entry.duration.toFixed(2)} ms`)
  })
})
performanceObserver.observe({ entryTypes: ['measure'] })

export default async function GrpcPerformance(context, next) {
  const isHealthRequest = context.fullName.includes('grpc.health')

  if (isHealthRequest) {
    return next()
  }

  performance.mark(context.fullName)

  function measure() {
    performance.mark(`${context.fullName}-ended`)
    performance.measure(
      context.fullName,
      context.fullName,
      `${context.fullName}-ended`,
    )
  }

  return next()
    .then(() => measure())
    .catch((error) => {
      measure()
      throw error
    })
}
