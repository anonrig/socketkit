import * as Application from '../../models/application.js'

export default async function getByPagination(
  { account_id },
  { limit, offset },
) {
  const [count, rows] = await Promise.all([
    Application.count({ account_id }),
    Application.findAll({ account_id }, { limit, offset }),
  ])

  return {
    rows,
    pages: Math.max(Math.floor(count / limit), 1),
    count,
  }
}
