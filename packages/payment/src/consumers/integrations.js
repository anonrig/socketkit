import { validate } from 'uuid'
import grpc from '@grpc/grpc-js'
import * as Integrations from '../models/integrations.js'
import * as Subscription from '../models/subscriptions.js'

export async function findOrCreate(ctx) {
  if (!validate(ctx.req.account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = await Integrations.findOrCreate(ctx.req)
}

export async function updateUsage(ctx) {
  const { account_id, usage } = ctx.req

  if (!validate(account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  await Subscription.update({ account_id, usage })
  ctx.res = {}
}
