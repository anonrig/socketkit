import path from 'path'
import Mali from 'mali'
import { addSchemas } from 'mali-ajv'

import Logger from './logger.js'
import * as Integrations from './consumers/integrations.js'
import * as Notifications from './consumers/notifications.js'

import * as integration_schemas from './consumers/integrations.schema.js'
import * as notification_schemas from './consumers/notifications.schema.js'

const logger = Logger.create().withScope('grpc')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const file = path.join(path.resolve(''), 'protofiles/notification.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')

const app = new Mali()

app.addService(file, 'Integrations', options)
app.addService(file, 'Notifications', options)
app.addService(health, 'Health', options)

app.use(
  addSchemas(app, {
    notifications: notification_schemas,
    integrations: integration_schemas,
  }),
)
app.use(async (context, next) => {
  logger.withScope('grpc').debug(`Receiving ${context.fullName}`)

  return next()
})

app.use({ Integrations, Notifications })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (error) => {
  if (!error.code) {
    logger.fatal(error)
  }
})

export default app
