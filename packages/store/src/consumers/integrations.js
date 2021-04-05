import pg from '../pg.js'
import * as Integrations from '../models/integrations.js'

export async function upsertAll(ctx) {
  const { account_id, applications } = ctx.req
  await pg.transaction((trx) =>
    Integrations.upsertAll({ account_id, applications }, trx),
  )
  ctx.res = {}
}

export async function findAll(ctx) {
  const { account_id } = ctx.req
  ctx.res = {
    rows: await Integrations.findAll({ account_id }),
  }
}
