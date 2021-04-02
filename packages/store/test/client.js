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
const { Applications, Integrations, Reviews } = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/store.proto'), defaults),
)

// @ts-ignore
export const applications = new Applications(
  url,
  grpc.credentials.createInsecure(),
)
export const integrations = new Integrations(
  url,
  grpc.credentials.createInsecure(),
)
export const reviews = new Reviews(url, grpc.credentials.createInsecure())
