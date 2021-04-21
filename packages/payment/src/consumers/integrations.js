import * as Integrations from '../models/integrations.js'

export async function findOrCreate(ctx) {
  ctx.res = await Integrations.findOrCreate(ctx.req)
}
