import * as SubscriptionPackage from '../../models/subscription-package.js'
import getCountries from '../../methods/get-countries.js'

export const findPackages = async (ctx) => {
  const { account_id, application_id } = ctx.req
  ctx.res = {
    rows: await SubscriptionPackage.findAll(
      { account_id, application_id },
      { limit: 10 },
    ),
  }
}

export const groupByApplication = async (ctx) => {
  const { account_id, application_id } = ctx.req
  ctx.res = {
    rows: await SubscriptionPackage.groupByApplication(
      { account_id, application_id },
      { limit: 10 },
    ),
  }
}

export const groupByCountry = async (ctx) => {
  const { account_id, application_id, start_date, end_date } = ctx.req
  ctx.res = {
    rows: await getCountries({
      account_id,
      application_id,
      start_date,
      end_date,
    }),
  }
}
