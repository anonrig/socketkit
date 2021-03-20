import * as SubscriberReports from '../../models/subscriber-reports.js'
import * as TrialReports from '../../models/trial-reports.js'
import * as SubscriptionReports from '../../models/subscription-reports.js'
import * as RevenueReports from '../../models/revenue-reports.js'

import grpc from '@grpc/grpc-js'

const reports = new Map([
  ['subscribers', SubscriberReports.get],
  ['customer-lifetime-value', SubscriberReports.getCustomerLifetimeValue],
  ['trials', TrialReports.getFreeTrials],
  ['trial-to-paid', TrialReports.getTrialToPaid],
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
    const error = new Error('Report not found')
    error.code = grpc.status.NOT_FOUND
    throw error
  }
  ctx.res = await reports.get(report_id)(ctx.req)
}
