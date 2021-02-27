import path from 'path'
import Mali from 'mali'
import Logger from './logger.js'
import * as Applications from './consumers/index.js'

const logger = Logger.create().withScope('grpc')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const file = path.join(path.resolve(''), 'protofiles/store.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')

const app = new Mali()

app.addService(file, 'Applications', options)
app.addService(health, 'Health', options)

app.use({ Applications })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (err) => {
  logger.fatal(err)
})

export default app
