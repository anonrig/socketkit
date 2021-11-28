import pg from './index.js'

export async function findAll(
  { account_id, application_id, subscriber_id, start_date, end_date },
  { limit = 10, cursor } = {},
) {
  return pg
    .queryBuilder()
    .select({
      subscriber_id: 't.subscriber_id',
      transaction_type: 't.transaction_type',
      event_date: 't.event_date',
      base_subscriber_purchase: 't.base_subscriber_purchase',
      base_developer_proceeds: 't.base_developer_proceeds',
      subscription_package_id: 't.subscription_package_id',
      subscription_package_name: 'p.name',
      application_id: 't.application_id',
      country_id: 'c.country_id',
    })
    .from('transactions as t')
    .innerJoin('subscription_packages as p', function () {
      this.using(['account_id', 'subscription_package_id'])
    })
    .innerJoin('subscribers as c', function () {
      this.using(['account_id', 'subscriber_id'])
    })
    .where('t.account_id', account_id)
    .andWhere(function () {
      if (application_id?.length) {
        this.andWhere('t.application_id', application_id)
      }

      if (subscriber_id?.length) {
        this.andWhere('t.subscriber_id', subscriber_id)
      }

      if (cursor) {
        const { event_date, subscriber_id } = cursor

        if (!event_date || !subscriber_id) {
          throw new Error(`Invalid cursor for pagination`)
        }

        this.whereRaw(`(t.event_date, t.subscriber_id) < (?, ?)`, [event_date, subscriber_id])
      }

      if (start_date && end_date) {
        this.andWhereBetween('t.event_date', [start_date, end_date])
      }
    })
    .orderByRaw(`t.event_date desc, t.subscriber_id desc`)
    .limit(limit)
}
