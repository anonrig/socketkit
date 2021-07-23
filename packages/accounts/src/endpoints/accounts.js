import grpc from '@grpc/grpc-js'

import pg from '../pg/index.js'
import * as Accounts from '../pg/accounts.js'
import * as Memberships from '../pg/memberships.js'

export async function findAll(ctx) {
  ctx.res = {
    rows: await Accounts.findAll(ctx.req),
  }
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

export async function findMembers(ctx) {
  const account = await Accounts.findOne({ account_id: ctx.req.account_id })

  if (!account) {
    const error = new Error('Account not found')
    error.code = grpc.status.NOT_FOUND
    throw error
  }

  ctx.res = {
    rows: await Memberships.findMembers(ctx.req),
  }
}

export async function addMember(ctx) {
  const account = await Accounts.findOne({ account_id: ctx.req.account_id })

  if (!account) {
    const error = new Error('Account not found')
    error.code = grpc.status.NOT_FOUND
    throw error
  }

  await pg.transaction((trx) => Memberships.addMember(ctx.req, trx))
  ctx.res = {}
}

export async function removeMember(ctx) {
  const account = await Accounts.findOne({ account_id: ctx.req.account_id })

  if (!account) {
    const error = new Error('Account not found')
    error.code = grpc.status.NOT_FOUND
    throw error
  }

  await pg.transaction((trx) => Memberships.removeMember(ctx.req, trx))
  ctx.res = {}
}
