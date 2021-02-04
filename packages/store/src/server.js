import f from 'fastify'
import compress from 'fastify-compress'
import helmet from 'fastify-helmet'
import tracer from 'cls-rtracer'
import auth from 'fastify-auth'
import sensible from 'fastify-sensible'

import health from './health.js'
import routes from './routes/index.js'

import Logger from './logger.js'

const logger = Logger.create().withScope('http-server')
const server = f({
  trustProxy: true,
  logger: {
    info: function (o) {
      logger.info(o)
    },
    warn: function (o) {
      logger.warn(o)
    },
    error: function (o) {
      logger.error(o)
    },
    fatal: function (o) {
      logger.fatal(o)
    },
    trace: function (o) {
      logger.trace(o)
    },
    debug: function (o) {
      logger.debug(o)
    },
    child: function () {
      return Object.create(this)
    },
  },
})

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

health(server)

export default server
