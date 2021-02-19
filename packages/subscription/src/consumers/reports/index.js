import getFreeTrials from '../../models/trial-reports.js'

export const trials = async (ctx) => (ctx.res = await getFreeTrials(ctx.req))
