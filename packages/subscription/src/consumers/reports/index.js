import * as SubscriberReports from '../../models/subscriber-reports.js'
import * as TrialReports from '../../models/trial-reports.js'
import * as SubscriptionReports from '../../models/subscription-reports.js'
import * as RevenueReports from '../../models/revenue-reports.js'

export const subscribers = async (ctx) => {
  ctx.res = await SubscriberReports.get(ctx.req)
}

export const trials = async (ctx) => {
  ctx.res = await TrialReports.getFreeTrials(ctx.req)
}

export const subscriptions = async (ctx) => {
  ctx.res = await SubscriptionReports.get(ctx.req)
}

export const averageDuration = async (ctx) => {
  ctx.res = await TrialReports.averageDuration(ctx.req)
}

export const mrr = async (ctx) => {
  ctx.res = await RevenueReports.getMRR(ctx.req)
}
