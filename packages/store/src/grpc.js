import GRPC from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'

import * as applications from './consumers/application/index.js'

const packageOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const pkg = loader.loadSync(
  path.join(path.resolve(''), 'protofiles', 'store.proto'),
  packageOptions,
)
const health_pkg = loader.loadSync(
  path.join(path.resolve(''), 'protofiles', 'health.proto'),
  packageOptions,
)

const { Store } = GRPC.loadPackageDefinition(pkg)
const health = GRPC.loadPackageDefinition(health_pkg).grpc.health.v1
const server = new GRPC.Server()

server.addService(health.Health.service, {
  Check: (_call, cb) => cb(null, { status: 1 }),
})
server.addService(Store.service, applications)

export const grpc = GRPC
export default server
