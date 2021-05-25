import { validate } from 'uuid'
import grpc from '@grpc/grpc-js'
import pg from '../pg.js'
import * as Integrations from '../models/integrations.js'

export async function upsertAll(ctx) {
  const { account_id, applications } = ctx.req

  if (!validate(account_id)) {
    const error = new Error(`Invalid account id`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  await pg.transaction((trx) =>
    Integrations.upsertAll({ account_id, applications }, trx),
  )
  ctx.res = {}
}

export async function findAll(ctx) {
  const { account_id } = ctx.req

  if (!validate(account_id)) {
    const error = new Error(`Invalid account id`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = {
    rows: await Integrations.findAll({ account_id }),
  }
}
