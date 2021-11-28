import * as Transaction from '../../pg/transaction-find.js'

import getById from './get-by-id.js'
import getByPagination from './get-by-pagination.js'

import getSubscriptionsById from './get-subscriptions-by-id.js'

export const findAll = async (ctx) => {
  const { account_id, application_id, start_date, end_date, limit, cursor } = ctx.req
  ctx.res = await getByPagination(
    { account_id, application_id, end_date, start_date },
    { cursor, limit },
  )
}

export const findOne = async (ctx) => {
  const { account_id, subscriber_id } = ctx.req
  ctx.res = {
    row: await getById({ account_id, subscriber_id }),
  }
}

export const findTransactions = async (ctx) => {
  const { account_id, subscriber_id } = ctx.req
  ctx.res = {
    rows: await Transaction.findAll({ account_id, subscriber_id }),
  }
}

export const findSubscriptions = async (ctx) => {
  const { account_id, subscriber_id } = ctx.req
  ctx.res = {
    rows: await getSubscriptionsById({ account_id, subscriber_id }),
  }
}
