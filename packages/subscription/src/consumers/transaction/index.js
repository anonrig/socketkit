import getByPagination from './get-by-pagination.js'
import * as TransactionStatistics from '../../pg/transaction-statistics.js'

export const findAll = async (ctx) => {
  const { account_id, application_id, start_date, end_date, limit, cursor } =
    ctx.req
  ctx.res = await getByPagination(
    { account_id, application_id, start_date, end_date },
    { limit, cursor },
  )
}

export const sum = async (ctx) => {
  ctx.res = await TransactionStatistics.sum(ctx.req)
}
