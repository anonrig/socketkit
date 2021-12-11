import pg from '../pg.js'
import * as Integrations from '../pg/integrations.js'

export async function findAll(ctx) {
  ctx.res = {
    rows: await Integrations.findAll(ctx.req),
  }
}

export async function upsert(ctx) {
  await pg.transaction((trx) => Integrations.upsert(ctx.req, trx))

  ctx.res = {}
}

export async function destroy(ctx) {
  await pg.transaction((trx) => Integrations.destroy(ctx.req, trx))

  ctx.res = {}
}
