import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'
import config from './config.js'
import { promisifyAll } from './helpers.js'

const defaults = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

const { Store } = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/store.proto'), defaults),
)

const {
  Accounts,
  Applications,
  Clients,
  Subscriptions,
  Transactions,
  Integrations,
} = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/subscription.proto'), defaults),
)

export default {
  accounts: promisifyAll(
    new Accounts(config.grpc.subscription, grpc.credentials.createInsecure()),
  ),
  applications: promisifyAll(
    new Applications(
      config.grpc.subscription,
      grpc.credentials.createInsecure(),
    ),
  ),
  clients: promisifyAll(
    new Clients(config.grpc.subscription, grpc.credentials.createInsecure()),
  ),
  subscriptions: promisifyAll(
    new Subscriptions(
      config.grpc.subscription,
      grpc.credentials.createInsecure(),
    ),
  ),
  transactions: promisifyAll(
    new Transactions(
      config.grpc.subscription,
      grpc.credentials.createInsecure(),
    ),
  ),
  integrations: promisifyAll(
    new Integrations(
      config.grpc.subscription,
      grpc.credentials.createInsecure(),
    ),
  ),
  store: promisifyAll(
    new Store(config.grpc.store, grpc.credentials.createInsecure()),
  ),
}
