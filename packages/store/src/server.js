import f from 'fastify'
import { createTerminus } from '@godaddy/terminus'
import compress from 'fastify-compress'
import helmet from 'fastify-helmet'
import tracer from 'cls-rtracer'
import auth from 'fastify-auth'
import sensible from 'fastify-sensible'

import health from './health.js'
import pg from './plugins/pg.js'
import routes from './routes/index.js'

const server = f({
  logger: {
    prettyPrint: process.env.NODE_ENV !== 'production',
    mixin() {
      return { request_id: tracer.id() }
    },
  },
  trustProxy: true,
})

server.register(pg)
server.register(sensible.default)
server.register(auth)
server.register(compress)
server.register(helmet)
server.register(tracer.fastifyPlugin, {
  useHeader: true,
  headerName: 'X-Request-Id',
  useFastifyRequestId: true,
  echoHeader: true,
})
server.register(routes, { prefix: '/v1' })
server.get('/', async () => ({ status: 'up' }))

createTerminus(server.server, {
  healthChecks: {
    '/health': health,
    verbatim: true,
  },
  logger: (message, error) => {
    server.log.error(message)
    server.log.warn(error)
  },
})

export default server
