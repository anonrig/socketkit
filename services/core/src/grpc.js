import path from 'path'

import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'

import config from './config.js'
import { promisifyAll } from './helpers.js'

const {
  Applications,
  Reviews,
  Integrations: StoreIntegrations,
} = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/store.proto'), config.grpc_options),
)

const { Subscribers, Subscriptions, Transactions, Integrations, Reports } =
  grpc.loadPackageDefinition(
    loader.loadSync(path.join('.', 'protofiles/subscription.proto'), config.grpc_options),
  )

const { Applications: TrackingApplications, Events } = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/tracking.proto'), config.grpc_options),
)

export default {
  applications: promisifyAll(
    new Applications(config.grpc.store, grpc.credentials.createInsecure()),
  ),
  events: new Events(config.grpc.tracking, grpc.credentials.createInsecure()),
  integrations: promisifyAll(
    new Integrations(config.grpc.subscription, grpc.credentials.createInsecure()),
  ),
  reports: promisifyAll(new Reports(config.grpc.subscription, grpc.credentials.createInsecure())),
  reviews: promisifyAll(new Reviews(config.grpc.store, grpc.credentials.createInsecure())),
  storeIntegrations: promisifyAll(
    new StoreIntegrations(config.grpc.store, grpc.credentials.createInsecure()),
  ),
  subscribers: promisifyAll(
    new Subscribers(config.grpc.subscription, grpc.credentials.createInsecure()),
  ),
  subscriptions: promisifyAll(
    new Subscriptions(config.grpc.subscription, grpc.credentials.createInsecure()),
  ),
  trackingApplications: new TrackingApplications(
    config.grpc.tracking,
    grpc.credentials.createInsecure(),
  ),
  transactions: promisifyAll(
    new Transactions(config.grpc.subscription, grpc.credentials.createInsecure()),
  ),
}
