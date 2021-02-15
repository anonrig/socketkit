import * as Client from '../../models/client.js'
import dayjs from 'dayjs'

export default async function getByPagination(
  { account_id, application_id, start_date, end_date },
  { limit, cursor } = {},
) {
  const rows = await Client.findAll(
    { account_id, application_id, start_date, end_date },
    { limit, cursor },
  )

  return {
    rows,
    cursor: {
      client_id: rows[rows.length - 1].client_id,
      first_interaction: rows[rows.length - 1].first_interaction,
    },
  }
}
