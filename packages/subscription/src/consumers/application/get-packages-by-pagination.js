import * as SubscriptionPackage from '../../models/subscription-package.js'

export default async function getPackagesByPagination(
  { account_id, application_id },
  { limit = 10 },
) {
  return {
    rows: SubscriptionPackage.findAll(
      { account_id, application_id },
      { limit },
    ),
  }
}
