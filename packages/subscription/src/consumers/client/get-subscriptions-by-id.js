import pg from '../../pg.js'
import dayjs from 'dayjs'

export default async function getSubscriptionsById({
  client_id,
  account_id,
}) {
  const subscriptions = await pg
    .select({
      subscription_active_period: 'client_subscriptions.active_period',
      subscription_package_id: 'client_subscriptions.subscription_package_id',
      subscription_package_name: 'subscription_packages.name',
      application_id: 'applications.application_id',
      application_name: 'applications.name',
    })
    .from('client_subscriptions')
    .join('applications', function () {
      this.using(['application_id', 'account_id'])
    })
    .join('subscription_packages', function () {
      this.using([
        'subscription_package_id',
        'account_id',
        'application_id',
      ])
    })
    .where('client_subscriptions.client_id', client_id)
    .andWhere('client_subscriptions.account_id', account_id)
    .orderByRaw('lower(client_subscriptions.active_period) desc')

    
  return subscriptions.map((s) => ({
    ...s,
    subscription_active_period: s.subscription_active_period
      .toString()
      .slice(1, -1)
      .split(',')
      .map((d) => dayjs(d).format('YYYY-MM-DD')),
  }))
}
