import * as Client from '../../models/client.js'
import dayjs from 'dayjs'

export default async function getByPagination(
  { account_id, application_id },
  { filter, limit, cursor },
) {
  const rows = await Client.findAll(
    { account_id, application_id },
    { filter, limit, cursor },
  )

  return {
    rows,
    cursor: {
      client_id: rows[rows.length - 1].client_id,
      first_interaction: dayjs(
        rows[rows.length - 1].client_first_interaction,
      ).format('YYYY-MM-DD'),
    },
  }
}
