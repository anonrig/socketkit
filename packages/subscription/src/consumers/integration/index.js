import AppStoreReporter from 'appstore-reporter'
import onValidate from './on-validate.js'
import * as Integrations from '../../models/integration.js'
import * as Providers from '../../models/provider.js'

export const validate = async (ctx) => {
  const { access_token } = ctx.req
  ctx.res = {
    state: await onValidate(access_token),
  }
}

export const create = async (ctx) => {
  const { account_id, provider_id, access_token } = ctx.req

  if (await Integrations.findOne({ account_id, provider_id })) {
    return (ctx.res = { state: true })
  }

  if (!(await Providers.findOne({ provider_id }))) {
    throw new Error(`Provider ${provider_id} not found`)
  }

  const reporter = new AppStoreReporter.default({ accessToken: access_token })
  const vendor_ids = await reporter.sales.getVendors()

  await Integrations.create({
    account_id,
    provider_id,
    access_token,
    vendor_ids,
  })

  ctx.res = {
    state: true,
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

export const update = async (ctx) => {
  const { account_id, provider_id, access_token } = ctx.req
  const integration = await Integrations.findOne({ account_id, provider_id })

  if (!integration) {
    throw new Error(`Integration not found`)
  }

  await Integrations.update({ account_id, provider_id, access_token })
  ctx.res = { state: true }
}

export const destroy = async (ctx) => {
  const { account_id, provider_id } = ctx.req
  await Integrations.destroy({ account_id, provider_id })
  ctx.res = { state: true }
}
