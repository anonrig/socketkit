import getStatistics from './get-statistics.js'
import getCountries from '../../methods/get-countries.js'

export const statistics = async (
  {
    request: {
      where: { account_id },
    },
  },
  callback,
) => {
  try {
    callback(null, await getStatistics({ account_id }))
  } catch (error) {
    callback(error)
  }
}

export const findCountries = async (
  {
    request: {
      where: { account_id },
      opts: { filter },
    },
  },
  callback,
) => {
  callback(null, { values: await getCountries({ account_id }, { filter }) })
}
