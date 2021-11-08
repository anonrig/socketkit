import * as Identities from '../pg/identities.js'
import pg from '../pg/index.js'
import * as Invitations from '../pg/invitations.js'

export async function findAccounts(ctx) {
  ctx.res = {
    rows: await Identities.findAccounts(ctx.req),
  }
}

export async function findInvitations(ctx) {
  ctx.res = { rows: await Invitations.findAll(ctx.req) }
}

export async function acceptInvitation(ctx) {
  await pg.transaction((trx) => Invitations.accept(ctx.req, trx))
  ctx.res = {}
}

export async function rejectInvitation(ctx) {
  await pg.transaction((trx) => Invitations.reject(ctx.req, trx))
  ctx.res = {}
}
