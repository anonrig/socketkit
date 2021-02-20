import path from 'path'
import Mali from 'mali'
import Logger from './logger.js'

import * as Clients from './consumers/client/index.js'
import * as Subscriptions from './consumers/subscription/index.js'
import * as Transactions from './consumers/transaction/index.js'
import * as Integrations from './consumers/integration/index.js'
import * as Reports from './consumers/reports/index.js'
import tracer from './tracer.js'
import { v4 } from 'uuid'

const logger = Logger.create().withScope('grpc')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const file = path.join(path.resolve(''), 'protofiles/subscription.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')

const app = new Mali()

app.addService(
  file,
  ['Clients', 'Subscriptions', 'Transactions', 'Integrations', 'Reports'],
  options,
)
app.addService(health, 'Health', options)

app.use(async (ctx, next) => {
  const requestId = ctx.request.metadata['x-request-id'] ?? v4()
  logger.debug(`Request to ${ctx.fullName}`)
  const span = tracer.getTracer('grpc').startSpan(ctx.fullName)
  span.setAttribute('name', ctx.name)
  span.setAttribute('service', ctx.service)
  span.setAttribute('fullName', ctx.fullName)
  span.setAttribute('type', ctx.type)
  try {
    await next()
    span.setStatus(200)
    span.end()
  } catch (error) {
    span.recordException(error)
    span.setStatus(500)
    span.end()
    throw error
  }
})

app.use({
  Clients,
  Subscriptions,
  Transactions,
  Integrations,
  Reports,
})
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (err) => {
  logger.fatal(err)
})

export default app
