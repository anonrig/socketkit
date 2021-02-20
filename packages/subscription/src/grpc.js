import path from 'path'
import Mali from 'mali'
import Logger from './logger.js'

import * as Clients from './consumers/client/index.js'
import * as Subscriptions from './consumers/subscription/index.js'
import * as Transactions from './consumers/transaction/index.js'
import * as Integrations from './consumers/integration/index.js'
import * as Reports from './consumers/reports/index.js'
import './tracer.js'

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
