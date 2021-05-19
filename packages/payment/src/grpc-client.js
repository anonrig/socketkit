import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'
import { promisifyAll } from './helpers.js'

const url = process.env.SUBSCRIPTION_GRPC_URL ?? `0.0.0.0:3001`
const defaults = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

const { Integrations } = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/subscription.proto'), defaults),
)

export const integrations = promisifyAll(
  new Integrations(url, grpc.credentials.createInsecure()),
)
