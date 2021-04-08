import dayjs from 'dayjs'
import AppStoreReporter from 'appstore-reporter'
import grpc from '@grpc/grpc-js'

import onValidate from './on-validate.js'
import * as Integrations from '../../models/integration.js'
import pg from '../../pg.js'

export const validate = async (ctx) => {
  const { access_token } = ctx.req
  try {
    const state = await onValidate(access_token)
    ctx.res = { state }
  } catch (error) {
    error.code = grpc.status.UNKNOWN
    throw error
  }
}

export const findAll = async (ctx) => {
  const { account_id } = ctx.req
  ctx.res = {
    rows: await Integrations.findAll({ account_id }),
  }
}

export const findOne = async (ctx) => {
  const { account_id, provider_id } = ctx.req
  const integration = await Integrations.findOne({ account_id, provider_id })

  ctx.res = {
    row: integration,
  }
}

export const upsert = async (ctx) => {
  const { account_id, provider_id, access_token } = ctx.req

  await pg.transaction(async (trx) => {
    const integration = await pg
      .queryBuilder()
      .select('*')
      .from('integrations')
      .where({ account_id, provider_id })
      .first()
      .transacting(trx)
      .forUpdate()

    if (!integration) {
      const reporter = new AppStoreReporter.default({
        accessToken: access_token,
      })
      const vendor_ids = await reporter.sales.getVendors()

      await pg
        .queryBuilder()
        .insert({
          account_id,
          provider_id,
          access_token,
          vendor_ids,
          last_fetch: dayjs().subtract(9, 'months'),
        })
        .into('integrations')
        .transacting(trx)
        .onConflict(['account_id', 'provider_id'])
        .merge()
    } else {
      await pg
        .queryBuilder()
        .update({ access_token })
        .where({ account_id, provider_id })
        .from('integrations')
        .transacting(trx)
    }

    return {}
  })

  ctx.res = { state: true }
}

export const destroy = async (ctx) => {
  const { account_id, provider_id } = ctx.req
  await Integrations.destroy({ account_id, provider_id })
  ctx.res = { state: true }
}
