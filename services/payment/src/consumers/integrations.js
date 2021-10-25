import { validate } from 'uuid'
import grpc from '@grpc/grpc-js'
import * as Integrations from '../models/integrations.js'

export async function findOrCreate(ctx) {
  if (!validate(ctx.req.account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = await Integrations.findOrCreate(ctx.req)
}
