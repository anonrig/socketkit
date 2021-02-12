import getByPagination from './get-by-pagination.js'

export const findAll = async (
  {
    request: {
      where: { account_id, application_id },
      opts: { filter, limit },
      cursor,
    },
  },
  callback,
) => {
  callback(
    null,
    await getByPagination(
      { account_id, application_id },
      { filter, limit, cursor },
    ),
  )
}
