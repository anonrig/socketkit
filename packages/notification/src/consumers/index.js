import pg from '../pg.js'
import * as Notifications from '../models/notifications.js'

export async function send(ctx) {
  await pg.transaction((trx) => Notifications.send(ctx.req, trx))
  ctx.res = {}
}
