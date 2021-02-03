import * as Client from '../../models/client.js'

export default async function getByPagination(
  { account_id, application_id },
  { filter, limit, offset },
) {
  const [count, rows] = await Promise.all([
    Client.count({ account_id, application_id }, { filter }),
    Client.findAll(
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
