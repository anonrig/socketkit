import * as Transaction from '../../models/client-transaction.js'

export default async function (
  { account_id, application_id },
  { filter, limit, offset },
) {
  const [count, rows] = await Promise.all([
    Transaction.count({ account_id, application_id }, { filter }),
    Transaction.findAll(
      { account_id, application_id },
      { filter, limit, offset },
    ),
  ])

  return {
    rows,
    pages: Math.max(Math.floor(count / limit), 1),
    count,
  }
}
