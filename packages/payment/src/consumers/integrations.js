import * as Integrations from '../models/integrations.js'
import * as Subscription from '../models/subscriptions.js'

export async function findOrCreate(ctx) {
  ctx.res = await Integrations.findOrCreate(ctx.req)
}

export async function updateUsage(ctx) {
  const { account_id, usage } = ctx.req
  await Subscription.update({ account_id, usage })
  ctx.res = {}
}
