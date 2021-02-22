import * as Reports from '../../models/trial-reports.js'

export const trials = async (ctx) => {
  ctx.res = await Reports.getFreeTrials(ctx.req)
}

export const averageDuration = async (ctx) => {
  ctx.res = await Reports.averageDuration(ctx.req)
}
