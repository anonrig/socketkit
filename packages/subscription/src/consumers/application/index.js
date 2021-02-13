import getStatistics from './get-statistics.js'
import getCountries from '../../methods/get-countries.js'

export const statistics = async (
  {
    request: {
      where: { account_id, application_id },
    },
  },
  callback,
) => {
  callback(null, await getStatistics({ account_id, application_id }))
}

export const findCountries = async (
  {
    request: {
      where: { account_id, application_id },
      opts: { filter },
    },
  },
  callback,
) => {
  callback(null, {
    values: await getCountries({ account_id, start_date: filter?.to, end_date: filter?.from }),
  })
}
