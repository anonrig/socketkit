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

const { Store } = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/store.proto'), defaults),
)

// @ts-ignore
const store = new Store(url, grpc.credentials.createInsecure())

export default store
