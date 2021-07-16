import pg from '../pg/index.js'
import * as Integrations from '../pg/integrations.js'

export async function findOrCreate(ctx) {
  ctx.res = await pg.transaction((trx) =>
    Integrations.findOrCreate(ctx.req, trx),
  )
}
