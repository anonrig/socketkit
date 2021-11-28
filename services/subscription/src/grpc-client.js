import path from 'path'

import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'

import { promisifyAll } from './helpers.js'

const url = process.env.STORE_GRPC_URL ?? `0.0.0.0:3003`
const defaults = {
  defaults: true,
  enums: String,
  keepCase: true,
  longs: String,
  oneofs: true,
}

const { Applications } = grpc.loadPackageDefinition(
  loader.loadSync(path.join('.', 'protofiles/store.proto'), defaults),
)

export default {
  store: {
    applications: promisifyAll(new Applications(url, grpc.credentials.createInsecure())),
  },
}
