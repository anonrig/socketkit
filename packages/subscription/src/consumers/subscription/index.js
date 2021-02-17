import * as SubscriptionPackage from '../../models/subscription-package.js'
import * as SubscriptionStatistics from '../../models/subscription-statistics.js'

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
  ctx.res = {
    rows: await SubscriptionStatistics.groupByCountry(ctx.req),
  }
}

export const count = async (ctx) => {
  ctx.res = await SubscriptionStatistics.count(ctx.req)
}
