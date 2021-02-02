import fp from 'fastify-plugin'
import pg from '../pg.js'

async function fastifyPg(fastify, _options, next) {
  fastify.decorate('pg', pg)
  fastify.pg = pg

  next()
}

export default fp(fastifyPg, {
  fastify: '>=1.1.0',
  name: 'fastify-pg',
})
