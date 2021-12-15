import path from 'path'

import ajvFormats from 'ajv-formats'
import Mali from 'mali'

import MaliAjv, { addSchemas } from 'mali-ajv'

import config from './config.js'
import * as Accounts from './endpoints/accounts.js'
import * as Identities from './endpoints/identities.js'
import grpcPerformance from './grpc.performance.js'
import Logger from './logger.js'

import schemas from './schemas/index.js'
const logger = Logger.create({}).withScope('grpc')
const folder = path.join(
  path.resolve(''),
  'node_modules/@socketkit/proto-definitions',
)
const accountsFile = path.join(folder, 'accounts.proto')
const healthFile = path.join(folder, 'health.proto')

const app = new Mali(
  accountsFile,
  ['Accounts', 'Identities'],
  config.grpc_options,
)

app.addService(healthFile, 'Health', config.grpc_options)

ajvFormats(MaliAjv)
app.use(addSchemas(app, schemas))

if (config.isDevelopment) {
  app.use(grpcPerformance)
}
app.use({ Accounts, Identities })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

/* c8 ignore start */
app.on('error', (error) => {
  if (!error.code) {
    logger.fatal(error)
  }
})
/* c8 ignore end */

export default app
