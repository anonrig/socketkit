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
const { Notifications, Integrations } = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/notification.proto'), defaults),
)

// @ts-ignore
export const notification = new Notifications(
  url,
  grpc.credentials.createInsecure(),
)

export const integration = new Integrations(
  url,
  grpc.credentials.createInsecure(),
)
