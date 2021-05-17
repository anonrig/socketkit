import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'
import config from '../src/config.js'

const url = process.env.SUBSCRIPTION_GRPC_URL ?? `0.0.0.0:${config.port}`
const defaults = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

const { Subscribers, Subscriptions, Transactions, Integrations, Reports } =
  grpc.loadPackageDefinition(
    loader.loadSync(path.join('.', 'protofiles/subscription.proto'), defaults),
  )

export default {
  subscribers: new Subscribers(url, grpc.credentials.createInsecure()),
  subscriptions: new Subscriptions(url, grpc.credentials.createInsecure()),
  transactions: new Transactions(url, grpc.credentials.createInsecure()),
  integrations: new Integrations(url, grpc.credentials.createInsecure()),
  reports: new Reports(url, grpc.credentials.createInsecure()),
}
