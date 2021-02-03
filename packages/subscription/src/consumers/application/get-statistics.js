import * as Transaction from '../../models/client-transaction.js'
import * as Application from '../../models/application.js'

import getActiveClientCount from '../../methods/get-active-client-count.js'
import dayjs from 'dayjs'

export default async function (
  { account_id, application_id },
  { filter } = {},
) {
  // TODO: Check if application exists.

  const [subscribers, transactions, mrr] = await Promise.all([
    getActiveClientCount(
      { account_id, application_id },
      { filter: { to: dayjs().format('YYYY-MM-DD') } },
    ),
    Transaction.count({ account_id }, { filter }),
    Application.findSales({ account_id, application_id }, { filter }),
  ])

  return {
    subscribers,
    transactions,
    mrr
  }
}
