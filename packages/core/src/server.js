import f from 'fastify'

import pressure from 'under-pressure'
import cors from 'fastify-cors'
import compress from 'fastify-compress'
import helmet from 'fastify-helmet'
import auth from 'fastify-auth'
import * as sensible from 'fastify-sensible'
import qs from 'qs'

import grpc from './plugins/custom.js'
import routes from './routes/index.js'
import Logger from './logger.js'
import pg from './pg.js'

const logger = Logger.create().withScope('http-server')
const server = f({
  querystringParser: (str) => qs.parse(str, { plainObjects: true }),
  trustProxy: true,
  disableRequestLogging: true,
  logger: {
    error: (message, ...args) => logger.error(message, args),
    warn: (message, ...args) => logger.warn(message, args),
  },
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
server.register(sensible)
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

server.register(routes, { prefix: '/v1' })
server.get('/', async () => ({ status: 'up' }))

server.addHook('onError', (request, reply, error, done) => {
  logger.error(error)
  done()
})

export default server
