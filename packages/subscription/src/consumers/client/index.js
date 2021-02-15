import getByPagination from './get-by-pagination.js'
import getById from './get-by-id.js'
import * as Transaction from '../../models/client-transaction.js'
import getSubscriptionsById from './get-subscriptions-by-id.js'

export const findAll = async (ctx) => {
  const {
    account_id,
    application_id,
    start_date,
    end_date,
    limit,
    cursor,
  } = ctx.req
  ctx.res = await getByPagination(
    { account_id, application_id, start_date, end_date },
    { limit, cursor },
  )
}

export const findOne = async (ctx) => {
  const { account_id, client_id } = ctx.req
  ctx.res = {
    row: await getById({ account_id, client_id }),
  }
}

export const findTransactions = async (ctx) => {
  const { account_id, client_id } = ctx.req
  ctx.res = {
    rows: await Transaction.findAll({ account_id, client_id }),
  }
}

export const findSubscriptions = async (ctx) => {
  const { account_id, client_id } = ctx.req
  ctx.res = {
    rows: await getSubscriptionsById({ account_id, client_id }),
  }
}
