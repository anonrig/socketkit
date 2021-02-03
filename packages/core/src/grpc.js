import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'
import config from './config.js'
import { promisifyAll } from './helpers.js'

const proto = loader.loadSync(path.join('.', 'protofiles', 'appstore.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const {
  Accounts,
  Applications,
  Clients,
  Transactions,
  Integrations,
} = grpc.loadPackageDefinition(proto)

export default {
  accounts: promisifyAll(
    new Accounts(config.grpc, grpc.credentials.createInsecure()),
  ),
  applications: promisifyAll(
    new Applications(config.grpc, grpc.credentials.createInsecure()),
  ),
  clients: promisifyAll(
    new Clients(config.grpc, grpc.credentials.createInsecure()),
  ),
  transactions: promisifyAll(
    new Transactions(config.grpc, grpc.credentials.createInsecure()),
  ),
  integrations: promisifyAll(
    new Integrations(config.grpc, grpc.credentials.createInsecure()),
  ),
}
