import f from 'fastify'
import Sentry from '@sentry/node'

import pressure from 'under-pressure'
import cors from 'fastify-cors'
import compress from 'fastify-compress'
import helmet from 'fastify-helmet'
import auth from 'fastify-auth'
import sensible from 'fastify-sensible'
import metrics from 'fastify-metrics'
import qs from 'qs'

import grpc from './plugins/custom.js'
import routes from './routes/index.js'
import pg from './pg.js'
import logger from './logger.js'

const server = f({
  querystringParser: (str) => qs.parse(str, { plainObjects: true }),
  trustProxy: true,
  disableRequestLogging: true,
  logger: false,
})

server.setErrorHandler(async (error) => {
  if (error.statusCode) {
    throw error
  } else {
    logger.error(error)
    Sentry.captureException(error)
    throw server.httpErrors.internalServerError('Something went wrong')
  }
})

server.register(pressure, {
  healthCheck: async function () {
    await pg.raw('select 1+1 as result')
    return true
  },
  healthCheckInterval: 1000,
  exposeStatusRoute: '/health',
})
server.register(grpc)
server.register(sensible, {
  errorHandler: false,
})
server.register(auth)
server.register(cors, {
  credentials: true,
  origin: [/\.socketkit\.com$/],
  methods: 'GET,POST,OPTIONS,PUT,DELETE',
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
server.register(metrics, { endpoint: '/metrics' })
server.register(routes, { prefix: '/v1' })
server.get('/', async () => ({ status: 'up' }))

server.addHook('onError', (request, reply, error, done) => {
  Sentry.withScope((scope) => {
    scope.setSpan(request.trace)
    scope.setUser({
      id: request.user.identity.id,
      email: request.user.identity.recovery_addresses[0].value,
    })
    Sentry.captureException(error)
  })
  done()
})

server.addHook('onRequest', (request, reply, done) => {
  if (request.routerPath?.startsWith('/v1/')) {
    request.trace = Sentry.startTransaction({
      op: request.method,
      name: request.routerPath,
      trimEnd: true,
    })
  }

  done()
})

server.addHook('onResponse', (request, reply, done) => {
  request.trace?.finish()
  done()
})

export default server
