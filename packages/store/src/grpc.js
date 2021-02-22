import path from 'path'
import Mali from 'mali'
import MaliLogger from '@malijs/logger'
import Logger from './logger.js'
import * as Store from './consumers/index.js'

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

app.use(
  MaliLogger({
    fullName: true,
    request: true,
    response: true,
  }),
)

app.addService(file, 'Store', options)
app.addService(health, 'Health', options)

app.use({ Store })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (err) => {
  logger.fatal(err)
})

export default app
