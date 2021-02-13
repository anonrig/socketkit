import * as SubscriptionPackage from '../../models/subscription-package.js'

export const groupByApplication = async (
  { request: { account_id } },
  callback,
) => {
  try {
    callback(null, {
      rows: await SubscriptionPackage.groupByApplication({ account_id }),
    })
  } catch (error) {
    callback(error)
  }
}

export const findPackages = async (
  { request: { account_id, application_id } },
  callback,
) => {
  try {
    callback(null, {
      rows: await SubscriptionPackage.findAll({ account_id, application_id }, { limit: 10 }),
    })
  } catch (error) {
    callback(error)
  }
}
