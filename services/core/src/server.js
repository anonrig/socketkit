import grpcjs from '@grpc/grpc-js'
import f from 'fastify'

import auth from 'fastify-auth'
import compress from 'fastify-compress'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import metrics from 'fastify-metrics'
import rawBody from 'fastify-raw-body'
import sensible from 'fastify-sensible'
import qs from 'qs'
import pressure from 'under-pressure'

import logger from './logger.js'
import pg from './pg.js'
import grpc from './plugins/custom.js'
import routes from './routes/index.js'
import ajv from './validation.js'

export default async function build() {
  const server = f({
    ajv,
    disableRequestLogging: true,
    logger: false,
    querystringParser: (str) => qs.parse(str, { plainObjects: true }),
    trustProxy: true,
  })

  server.setErrorHandler(async (error) => {
    if (error.code) {
      // Handle grpc related error codes.
      switch (error.code) {
        case grpcjs.status.NOT_FOUND:
          throw server.httpErrors.notFound(error.message)
        case grpcjs.status.PERMISSION_DENIED:
          throw server.httpErrors.unauthorized(error.message)
        case grpcjs.status.RESOURCE_EXHAUSTED:
          throw server.httpErrors.serviceUnavailable(error.message)
        default:
          logger.fatal(error)
          throw server.httpErrors.internalServerError('Something went wrong')
      }
    } else if (error.statusCode) {
      // Handle custom error codes
      throw error
    } else {
      // Handle uncaught errors due to runtime issues
      logger.error(error)
      throw server.httpErrors.internalServerError('Something went wrong')
    }
  })

  server.register(pressure, {
    exposeStatusRoute: '/health',
    healthCheck: async function () {
      await pg.raw('select 1+1 as result')
      return true
    },
    healthCheckInterval: 1000,
  })
  server.register(rawBody, {
    encoding: 'utf8',
    field: 'rawBody',
    global: false,
  })
  server.register(grpc)
  server.register(sensible, {
    errorHandler: false,
  })
  server.register(auth)
  server.register(cors, {
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
    credentials: true,
    maxAge: 1728000,
    methods: 'GET,POST,OPTIONS,PUT,DELETE',
    origin: [/\.socketkit\.com$/],
  })
  server.register(compress)
  server.register(helmet)
  server.register(metrics, { endpoint: '/metrics' })
  server.register(routes, { prefix: '/v1' })
  server.get('/', async () => ({ status: 'up' }))

  return server
}
