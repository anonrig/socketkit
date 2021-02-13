import * as SubscriptionPackage from '../../models/subscription-package.js'
import getCountries from '../../methods/get-countries.js'

export const findPackages = async ({ request }, callback) => {
  try {
    callback(null, {
      rows: await SubscriptionPackage.findAll(request, { limit: 10 }),
    })
  } catch (error) {
    callback(error)
  }
}

export const groupByApplication = async ({ request }, callback) => {
  try {
    callback(null, {
      rows: await SubscriptionPackage.groupByApplication(request),
    })
  } catch (error) {
    callback(error)
  }
}

export const groupByCountry = async ({ request }, callback) => {
  try {
    callback(null, {
      rows: await getCountries(request),
    })
  } catch (error) {
    callback(error)
  }
}
