import path from 'path'

import Mali from 'mali'
import { addSchemas } from 'mali-ajv'

import config from './config.js'
import * as Integrations from './consumers/integrations.js'
import * as integration_schemas from './consumers/integrations.schema.js'
import * as Notifications from './consumers/notifications.js'
import * as notification_schemas from './consumers/notifications.schema.js'
import Logger from './logger.js'

import ajv from './validator.js'

const logger = Logger.create({}).withScope('grpc')
const folder = path.join(path.resolve(''), 'node_modules/@socketkit/proto-definitions')
const notificationFile = path.join(folder, 'notification.proto')
const healthFile = path.join(folder, 'health.proto')
const app = new Mali(notificationFile, ['Integrations', 'Notifications'], config.grpc_options)

app.addService(healthFile, 'Health', config.grpc_options)

app.use(
  addSchemas(
    app,
    {
      integrations: integration_schemas,
      notifications: notification_schemas,
    },
    { ajv },
  ),
)

app.use({ Integrations, Notifications })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

/* c8 ignore start */
app.on('error', (error) => {
  if (!error.code) {
    logger.fatal(error)
  }
})
/* c8 ignore end */

export default app
