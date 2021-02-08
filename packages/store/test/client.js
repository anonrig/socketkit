import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'

const config = process.env.GRPC_STORE_URL ?? '0.0.0.0:3003'
const defaults = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

const { Store } = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles', 'store.proto'), defaults),
)

// @ts-ignore
const store = new Store(config, grpc.credentials.createInsecure())

export default store
