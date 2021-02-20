import f from 'fastify'

import cors from 'fastify-cors'
import compress from 'fastify-compress'
import helmet from 'fastify-helmet'
import tracer from 'cls-rtracer'
import auth from 'fastify-auth'
import * as sensible from 'fastify-sensible'
import jaeger from 'fastify-jaeger'
import qs from 'qs'

import health from './health.js'
import grpc from './plugins/custom.js'
import routes from './routes/index.js'
import addSchemas from './schemas.js'
import Logger from './logger.js'

const logger = Logger.create().withScope('http-server')
const server = f({
  querystringParser: (str) => qs.parse(str, { plainObjects: true }),
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
  disableRequestLogging: true,
})

addSchemas(server)

server.register(jaeger, {
  serviceName: 'core-worker',
  reporter: {
    collectorEndpoint:
      'http://linkerd-jaeger.linkerd.svc.cluster.local:14268/api/traces',
  },
})
server.register(grpc)
server.register(sensible)
server.register(auth)
server.register(cors, {
  credentials: true,
  origin:
    process.env.NODE_ENV === 'production' ? 'https://web.socketkit.com' : true,
  methods: 'GET,POST,OPTIONS,PUT,DELETE,PATCH',
  allowedHeaders: [
    'Authorization',
    'Accept',
    'Origin',
    'DNT',
    'Keep-Alive',
    'User-Agent',
    'X-Requested-With',
    'X-Request-Id',
    'If-Modified-Since',
    'Cache-Control',
    'Content-Type',
    'Content-Range',
    'Range',
  ],
  maxAge: 1728000,
})
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

server.addHook('onError', (request, reply, error, done) => {
  logger.error(error)
  done()
})

health(server)

export default server
