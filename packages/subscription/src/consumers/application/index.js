import getStatistics from './get-statistics.js'
import getCountries from '../../methods/get-countries.js'

export async function statistics(ctx) {
  const { account_id, application_id } = ctx.req
  ctx.res = await getStatistics({ account_id, application_id })
}

export async function findCountries(ctx) {
  const { account_id, application_id, start_date, end_date } = ctx.req
  ctx.res = {
    rows: await getCountries({
      account_id,
      application_id,
      start_date,
      end_date,
    }),
  }
}
