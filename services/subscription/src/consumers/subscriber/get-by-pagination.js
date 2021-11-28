import * as Subscriber from '../../pg/subscriber-find.js'

export default async function getByPagination(
  { account_id, application_id, start_date, end_date },
  { limit, cursor } = {},
) {
  const rows = await Subscriber.findAll(
    { account_id, application_id, end_date, start_date },
    { cursor, limit },
  )

  const pagination_cursor =
    rows.length && rows.length === limit
      ? {
          first_interaction: rows[rows.length - 1].first_interaction,
          subscriber_id: rows[rows.length - 1].subscriber_id,
        }
      : null

  return {
    cursor: pagination_cursor,
    rows,
  }
}
