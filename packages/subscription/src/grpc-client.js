import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'
import config from './config.js'
import { promisifyAll } from './helpers.js'

const proto = loader.loadSync(path.join('.', 'protofiles', 'store.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const { Store } = grpc.loadPackageDefinition(proto)

export default {
  store: promisifyAll(
    new Store(config.grpc.store, grpc.credentials.createInsecure()),
  ),
}
