import pg from '../../pg.js'
import dayjs from 'dayjs'

export default async function getSubscriptionsById({ client_id, account_id }) {
  const subscriptions = await pg
    .select({
      subscription_active_period: 's.active_period',
      subscription_package_id: 's.subscription_package_id',
      subscription_package_name: 'p.name',
      application_id: 's.application_id',
    })
    .from('client_subscriptions as s')
    .join('subscription_packages as p', function () {
      this.using(['subscription_package_id', 'account_id', 'application_id'])
    })
    .where('s.client_id', client_id)
    .andWhere('s.account_id', account_id)
    .orderByRaw('lower(s.active_period) desc')

  return subscriptions.map((s) => ({
    ...s,
    subscription_active_period: s.subscription_active_period
      .toString()
      .slice(1, -1)
      .split(',')
      .map((d) => dayjs(d).format('YYYY-MM-DD')),
  }))
}
