import * as SubscriberReports from '../../models/subscriber-reports.js'
import * as TrialReports from '../../models/trial-reports.js'
import * as SubscriptionReports from '../../models/subscription-reports.js'
import * as RevenueReports from '../../models/revenue-reports.js'

const reports = {
  subscribers: SubscriberReports.get,
  trials: TrialReports.getFreeTrials,
  'average-sales-cycle': TrialReports.averageDuration,
  subscriptions: SubscriptionReports.get,
  'average-revenue-per-subscription': SubscriptionReports.get,
  mrr: RevenueReports.getMRR,
  'sales-refunds': RevenueReports.getSalesRefunds,
}

export const get = async (ctx) => {
  const report_func = reports[ctx.req.report_id]
  if (!report_func) {
    throw new Error('Report not found')
  }
  ctx.res = await report_func(ctx.req)
}
