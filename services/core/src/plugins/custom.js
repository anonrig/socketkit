import fp from 'fastify-plugin'

import grpc from '../grpc.js'
import pg from '../pg.js'

async function customClients(fastify, _options, next) {
  fastify.decorate('grpc', grpc)
  fastify.decorate('pg', pg)
  fastify.grpc = grpc
  fastify.pg = pg

  next()
}

export default fp(customClients, {
  fastify: '>=1.1.0',
  name: 'fastify-custom-clients',
})
