import * as grpc from '../grpc.js'
import pg from '../pg.js'
import { Session } from '@ory/kratos-client'

declare module 'fastify' {
  export interface FastifyInstance {
    grpc: typeof grpc
    pg: typeof pg
  }

  export interface FastifyRequest {
    user: Session
  }
}
