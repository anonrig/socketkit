import { validate } from 'uuid'
import grpc from '@grpc/grpc-js'

import pg from '../pg.js'
import * as Integrations from '../models/integrations.js'

export async function findAll(ctx) {
  const { account_id } = ctx.req

  if (!validate(account_id)) {
    const error = new Error(`Account id is invalid`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = {
    rows: await Integrations.findAll({ account_id }),
  }
}

export async function upsert(ctx) {
  const { account_id, provider_id, requirement } = ctx.req

  if (!validate(account_id)) {
    const error = new Error(`Account id is invalid`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  await pg.transaction((trx) =>
    Integrations.upsert({ account_id, provider_id, requirement }, trx),
  )
  ctx.res = {}
}

export async function destroy(ctx) {
  const { account_id, provider_id } = ctx.req

  if (!validate(account_id)) {
    const error = new Error(`Account id is invalid`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  await pg.transaction((trx) =>
    Integrations.destroy({ account_id, provider_id }, trx),
  )
  ctx.res = {}
}