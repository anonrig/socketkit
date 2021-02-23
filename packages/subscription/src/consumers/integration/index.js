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
    throw new Error(`Provider ${provider_id} does not exist`)
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
