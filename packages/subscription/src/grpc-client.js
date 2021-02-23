import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'

const url = process.env.STORE_GRPC_URL ?? `0.0.0.0:3003`
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

export default {
  store: new Store(url, grpc.credentials.createInsecure()),
}
