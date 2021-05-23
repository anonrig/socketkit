import pg from '../../pg/index.js'

export default async function getSubscriptionsById({
  subscriber_id,
  account_id,
}) {
  const subscriptions = await pg
    .select({
      subscription_active_period: 's.active_period',
      subscription_package_id: 's.subscription_package_id',
      subscription_package_name: 'p.name',
      application_id: 's.application_id',
    })
    .from('subscriptions as s')
    .join('subscription_packages as p', function () {
      this.using(['subscription_package_id', 'account_id', 'application_id'])
    })
    .where('s.subscriber_id', subscriber_id)
    .andWhere('s.account_id', account_id)
    .orderBy('s.subscription_started_at', 'DESC')

  return subscriptions.map((s) => ({
    ...s,
    subscription_active_period: s.subscription_active_period
      .toString()
      .slice(1, -1)
      .split(','),
  }))
}
