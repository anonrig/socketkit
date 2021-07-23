import pg from '../pg/index.js'
import * as Memberships from '../pg/memberships.js'

export async function findOrCreate(ctx) {
  ctx.res = await pg.transaction((trx) =>
    Memberships.findOrCreate(ctx.req, trx),
  )
}
