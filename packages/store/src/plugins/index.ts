import pg from '../pg.js'

declare module 'fastify' {
  export interface FastifyInstance {
    pg: typeof pg
  }
}
