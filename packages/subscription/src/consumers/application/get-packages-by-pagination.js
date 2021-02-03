import * as SubscriptionPackage from '../../models/subscription-package.js'

export default async function getPackagesByPagination(
  { account_id, application_id },
  { limit = 10, offset = 0 },
) {
  const [count, rows] = await Promise.all([
    SubscriptionPackage.count({ account_id, application_id }),
    SubscriptionPackage.findAll(
      { account_id, application_id },
      { limit, offset },
    ),
  ])

  return {
    rows,
    pages: Math.max(Math.floor(count / limit), 1),
    count,
  }
}
