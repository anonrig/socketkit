import grpc from '@grpc/grpc-js'

import * as RevenueReports from '../../pg/reports/revenue.js'
import * as SubscriberReports from '../../pg/reports/subscriber.js'
import * as SubscriptionReports from '../../pg/reports/subscription.js'
import * as TrialReports from '../../pg/reports/trial.js'

const reports = new Map([
  ['subscribers', SubscriberReports.get],
  ['customer-lifetime-value', SubscriberReports.getCustomerLifetimeValue],
  ['active-trials', TrialReports.getActive],
  ['trials', TrialReports.get],
  ['trial-to-paid', TrialReports.getTrialToPaid],
  ['average-sales-cycle', TrialReports.getAverageDuration],
  ['subscriptions', SubscriberReports.get],
  ['average-revenue-per-subscription', SubscriptionReports.get],
  ['revenue', RevenueReports.get],
  ['recurring-revenue', RevenueReports.getRecurring],
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
