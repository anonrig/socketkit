import * as Transaction from '../../models/client-transaction.js'
import dayjs from 'dayjs'

export default async function (
  { account_id, application_id },
  { filter, limit, cursor },
) {
  const rows = await Transaction.findAll(
    { account_id, application_id },
    { filter, limit, cursor },
  )

  return {
    rows,
    cursor: {
      event_date: dayjs(rows[rows.length - 1].event_date).format('YYYY-MM-DD'),
      client_id: rows[rows.length - 1].client_id,
    },
  }
}
