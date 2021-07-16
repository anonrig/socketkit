import * as Integrations from '../pg/integrations.js'

export async function findOrCreate(ctx) {
  ctx.res = await Integrations.findOrCreate(ctx.req)
}
