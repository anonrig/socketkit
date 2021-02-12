import pg from '../../pg.js'
import getByPagination from './get-by-pagination.js'
import getStatistics from './get-statistics.js'
import getPackagesByPagination from './get-packages-by-pagination.js'
import getCountries from '../../methods/get-countries.js'

export const findAll = async (
  {
    request: {
      where: { account_id },
      opts: { limit },
    },
  },
  callback,
) => {
  try {
    callback(null, await getByPagination({ account_id }, { limit }))
  } catch (error) {
    callback(error)
  }
}

export const findOne = async (
  {
    request: {
      where: { account_id, application_id },
    },
  },
  callback,
) => {
  callback(null, {
    application: await pg
      .select({
        application_id: 'application_id',
        application_name: 'name',
        account_id: 'account_id',
        provider_id: 'provider_id',
      })
      .from('applications')
      .where({ account_id, application_id })
      .first(),
  })
}

export const findSubscriptionPackages = async (
  {
    request: {
      where: { account_id, application_id },
    },
  },
  callback,
) => {
  callback(
    null,
    await getPackagesByPagination({ account_id, application_id }, {}),
  )
}

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
    values: await getCountries({ account_id, application_id }, { filter }),
  })
}
