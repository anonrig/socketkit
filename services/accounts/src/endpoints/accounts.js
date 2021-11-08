import grpc from '@grpc/grpc-js'

import * as Accounts from '../pg/accounts.js'
import pg from '../pg/index.js'
import * as Invitations from '../pg/invitations.js'

export async function findOrCreate(ctx) {
  ctx.res = await pg.transaction((trx) => Accounts.findOrCreate(ctx.req, trx))
}

export async function findInvitations(ctx) {
  ctx.res = { rows: await Invitations.findAll(ctx.req) }
}

export async function update(ctx) {
  const account = await Accounts.findOne({ account_id: ctx.req.account_id })

  if (!account) {
    const error = new Error('Account not found')
    error.code = grpc.status.NOT_FOUND
    throw error
  }

  if (account.owner_identity_id !== ctx.req.identity_id) {
    const error = new Error('Permission denied')
    error.code = grpc.status.PERMISSION_DENIED
    throw error
  }

  await pg.transaction((trx) => Accounts.update(ctx.req, trx))
  ctx.res = {}
}

export async function invite(ctx) {
  await pg.transaction((trx) => Invitations.create(ctx.req, trx))
  ctx.res = {}
}

export async function findMembers(ctx) {
  ctx.res = {
    rows: await Accounts.findMembers(ctx.req),
  }
}

export async function removeMember(ctx) {
  await pg.transaction((trx) => Accounts.removeMember(ctx.req, trx))
  ctx.res = {}
}
