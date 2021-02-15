import getByPagination from './get-by-pagination.js'

export const findAll = async (ctx) => {
  const {
    account_id,
    application_id,
    start_date,
    end_date,
    limit,
    cursor,
  } = ctx.req
  ctx.res = await getByPagination(
    { account_id, application_id, start_date, end_date },
    { limit, cursor },
  )
}
