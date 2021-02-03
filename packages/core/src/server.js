import f from 'fastify'

import health from './health.js'

import cors from 'fastify-cors'
import compress from 'fastify-compress'
import helmet from 'fastify-helmet'
import tracer from 'cls-rtracer'
import auth from 'fastify-auth'
import sensible from 'fastify-sensible'

import grpc from './plugins/custom.js'

import routes from './routes/index.js'
import addSchemas from './schemas.js'

const server = f({
  trustProxy: true,
})

addSchemas(server)

server.register(grpc)
server.register(sensible.default)
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

health(server)

export default server
