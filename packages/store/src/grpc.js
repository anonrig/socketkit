import path from 'path'
import Mali from 'mali'
import Sentry from '@sentry/node'
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

const app = new Mali()

app.addService(file, 'Reviews', options)
app.addService(file, 'Applications', options)
app.addService(file, 'Integrations', options)

app.addService(health, 'Health', options)

app.use(async (context, next) => {
  logger.withScope('grpc').debug(`Receiving ${context.fullName}`)

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

  return next().then(() => tracer?.finish())
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
