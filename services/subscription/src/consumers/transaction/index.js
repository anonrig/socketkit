import * as TransactionStatistics from '../../pg/transaction-statistics.js'

import getByPagination from './get-by-pagination.js'

export const findAll = async (ctx) => {
  const { account_id, application_id, start_date, end_date, limit, cursor } = ctx.req
  ctx.res = await getByPagination(
    { account_id, application_id, end_date, start_date },
    { cursor, limit },
  )
}

export const sum = async (ctx) => {
  ctx.res = await TransactionStatistics.sum(ctx.req)
}
