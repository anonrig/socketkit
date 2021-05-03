import * as Subscriber from '../../models/subscriber-find.js'

export default async function getByPagination(
  { account_id, application_id, start_date, end_date },
  { limit, cursor } = {},
) {
  const rows = await Subscriber.findAll(
    { account_id, application_id, start_date, end_date },
    { limit, cursor },
  )

  const pagination_cursor =
    rows.length && rows.length === limit
      ? {
          subscriber_id: rows[rows.length - 1].subscriber_id,
          first_interaction: rows[rows.length - 1].first_interaction,
        }
      : null

  return {
    rows,
    cursor: pagination_cursor,
  }
}
