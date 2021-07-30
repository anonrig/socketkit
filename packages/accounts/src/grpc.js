import path from 'path'
import Mali from 'mali'
import Sentry from '@sentry/node'

import ajvFormats from 'ajv-formats'
import grpcPerformance from './grpc.performance.js'
import Logger from './logger.js'
import * as Accounts from './endpoints/accounts.js'
import * as Identities from './endpoints/identities.js'

import MaliAjv, { addSchemas } from 'mali-ajv'
import schemas from './schemas/index.js'
const logger = Logger.create({}).withScope('grpc')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const file = path.join(path.resolve(''), 'protofiles/accounts.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')

const app = new Mali(file, ['Accounts', 'Identities'], options)

app.addService(health, 'Health', options)

ajvFormats(MaliAjv)
app.use(addSchemas(app, schemas))
app.use(grpcPerformance)
app.use({ Accounts, Identities })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (error) => {
  if (!error.code) {
    Sentry.captureException(error)
    logger.fatal(error)
  }
})

export default app
