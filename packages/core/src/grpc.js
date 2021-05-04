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

const {
  Applications,
  Reviews,
  Integrations: StoreIntegrations,
} = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/store.proto'), defaults),
)

const {
  Subscribers,
  Subscriptions,
  Transactions,
  Integrations,
  Reports,
} = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/subscription.proto'), defaults),
)

const {
  Integrations: PaymentIntegrations,
  Payments,
} = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/payment.proto'), defaults),
)

export default {
  subscribers: promisifyAll(
    new Subscribers(config.grpc.subscription, grpc.credentials.createInsecure()),
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
  applications: promisifyAll(
    new Applications(config.grpc.store, grpc.credentials.createInsecure()),
  ),
  reviews: promisifyAll(
    new Reviews(config.grpc.store, grpc.credentials.createInsecure()),
  ),
  storeIntegrations: promisifyAll(
    new StoreIntegrations(config.grpc.store, grpc.credentials.createInsecure()),
  ),
  reports: promisifyAll(
    new Reports(config.grpc.subscription, grpc.credentials.createInsecure()),
  ),
  paymentIntegrations: promisifyAll(
    new PaymentIntegrations(
      config.grpc.payment,
      grpc.credentials.createInsecure(),
    ),
  ),
  payments: promisifyAll(
    new Payments(config.grpc.payment, grpc.credentials.createInsecure()),
  ),
}
