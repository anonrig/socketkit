import * as Transaction from '../../models/client-transaction.js'

export default async function (
  { account_id, application_id, start_date, end_date },
  { limit, cursor },
) {
  const rows = await Transaction.findAll(
    { account_id, application_id, start_date, end_date },
    { limit, cursor },
  )

  const pagination_cursor =
    rows.length && rows.length === limit
      ? {
          event_date: rows[rows.length - 1].event_date,
          client_id: rows[rows.length - 1].client_id,
        }
      : null

  return {
    rows,
    cursor: pagination_cursor,
  }
}
