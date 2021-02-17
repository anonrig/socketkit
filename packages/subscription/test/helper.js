// @ts-nocheck
import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'
import config from '../src/config.js'

const url = process.env.GRPC_STORE_URL ?? `0.0.0.0:${config.port}`
const defaults = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

const {
  Clients,
  Subscriptions,
  Transactions,
  Integrations,
} = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/subscription.proto'), defaults),
)

export default {
  clients: new Clients(url, grpc.credentials.createInsecure()),
  subscriptions: new Subscriptions(url, grpc.credentials.createInsecure()),
  transactions: new Transactions(url, grpc.credentials.createInsecure()),
  integrations: new Integrations(url, grpc.credentials.createInsecure()),
}
