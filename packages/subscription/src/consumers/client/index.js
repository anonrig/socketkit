import getByPagination from './get-by-pagination.js'
import getById from './get-by-id.js'
import getTransactionsById from './get-transactions-by-id.js'
import getSubscriptionsById from './get-subscriptions-by-id.js'

export const findAll = async (
  {
    request: {
      where: { account_id, application_id },
      opts: { filter, limit },
      cursor,
    },
  },
  callback,
) => {
  try {
    callback(
      null,
      await getByPagination(
        { account_id, application_id },
        { filter, limit, cursor },
      ),
    )
  } catch (error) {
    callback(error)
  }
}

export const findOne = async (
  {
    request: {
      where: { account_id, client_id },
    },
  },
  callback,
) => {
  try {
    callback(null, await getById({ account_id, client_id }))
  } catch (error) {
    callback(error)
  }
}

export const findTransactions = async (
  {
    request: {
      where: { account_id, client_id },
    },
  },
  callback,
) => {
  try {
    callback(null, {
      transactions: await getTransactionsById({ account_id, client_id }),
    })
  } catch (error) {
    callback(error)
  }
}

export const findSubscriptions = async (
  {
    request: {
      where: { account_id, client_id },
    },
  },
  callback,
) => {
  try {
    callback(null, {
      subscriptions: await getSubscriptionsById({ account_id, client_id }),
    })
  } catch (error) {
    callback(error)
  }
}
