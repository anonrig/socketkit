import * as SubscriberReports from '../../models/subscriber-reports.js'
import * as TrialReports from '../../models/trial-reports.js'
import * as SubscriptionReports from '../../models/subscription-reports.js'
import * as RevenueReports from '../../models/revenue-reports.js'

const reports = new Map([
  ['subscribers', SubscriberReports.get],
  ['trials', TrialReports.getFreeTrials],
  ['average-sales-cycle', TrialReports.averageDuration],
  ['subscriptions', SubscriberReports.get],
  ['average-revenue-per-subscription', SubscriptionReports.get],
  ['mrr', RevenueReports.getMRR],
  ['sales-refunds', RevenueReports.getSalesRefunds],
  ['average-sale', RevenueReports.getAverageSale],
])

export const get = async (ctx) => {
  const { report_id } = ctx.req
  if (!reports.has(report_id)) {
    throw new Error(`Report not found`)
  }
  ctx.res = await reports.get(report_id)(ctx.req)
}
