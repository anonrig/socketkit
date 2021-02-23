import * as TrialReports from '../../models/trial-reports.js'
import * as RevenueReports from '../../models/revenue-reports.js'

export const trials = async (ctx) => {
  ctx.res = await TrialReports.getFreeTrials(ctx.req)
}

export const averageDuration = async (ctx) => {
  ctx.res = await TrialReports.averageDuration(ctx.req)
}

export const mrr = async (ctx) => {
  ctx.res = await RevenueReports.getMRR(ctx.req)
}
