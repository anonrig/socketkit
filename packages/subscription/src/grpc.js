import GRPC from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'

import * as account from './consumers/account/index.js'
import * as applications from './consumers/application/index.js'
import * as clients from './consumers/client/index.js'
import * as transactions from './consumers/transaction/index.js'
import * as integrations from './consumers/integration/index.js'

const packageOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const pkg = loader.loadSync(path.join(path.resolve(''), 'protofiles', 'appstore.proto'), packageOptions)
const health_pkg = loader.loadSync(path.join(path.resolve(''), 'protofiles', 'health.proto'), packageOptions)

const { Accounts, Applications, Clients, Transactions, Integrations } = GRPC.loadPackageDefinition(pkg)
const health = GRPC.loadPackageDefinition(health_pkg).grpc.health.v1
const server = new GRPC.Server()

server.addService(health.Health.service, {
  Check: (_call, cb) => cb(null, { status: 1 }),
})
server.addService(Accounts.service, account)
server.addService(Applications.service, applications)
server.addService(Clients.service, clients)
server.addService(Transactions.service, transactions)
server.addService(Integrations.service, integrations)

export const grpc = GRPC
export default server
