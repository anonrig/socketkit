import path from 'path'
import Mali from 'mali'
import Sentry from '@sentry/node'

import Logger from './logger.js'
import * as Accounts from './endpoints/accounts.js'
import * as Memberships from './endpoints/memberships.js'

const logger = Logger.create().withScope('grpc')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const file = path.join(path.resolve(''), 'protofiles/accounts.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')

const app = new Mali()

app.addService(file, 'Memberships', options)
app.addService(file, 'Accounts', options)
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
  return next()
    .then(() => {
      tracer?.finish()
    })
    .catch((error) => {
      Sentry.captureException(error)
      logger.fatal(error)
      tracer?.finish()
      throw error
    })
})

app.use({ Accounts, Memberships })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (error) => {
  if (!error.code) {
    Sentry.captureException(error)
    logger.fatal(error)
  }
})

export default app
