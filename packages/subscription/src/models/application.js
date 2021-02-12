import pg from '../pg.js'
import dayjs from 'dayjs'

export async function findAll({ account_id }, { limit = 10 }) {
  return pg('applications')
    .select({
      application_id: 'applications.application_id',
      application_name: 'applications.name',
      provider_id: 'applications.provider_id',
      account_id: 'applications.account_id',
      subscription_package_count: pg.raw(
        'COUNT(subscription_packages.subscription_package_id)',
      ),
    })
    .innerJoin('subscription_packages', function () {
      this.on(
        'subscription_packages.application_id',
        'applications.application_id',
      ).andOn('subscription_packages.account_id', 'applications.account_id')
    })
    .where('applications.account_id', account_id)
    .groupBy(['applications.application_id', 'applications.account_id'])
    .orderByRaw('applications.name desc')
    .limit(limit)
}

export async function totalSales({ account_id, application_id }, { filter }) {
  const { sum } = await pg
    .queryBuilder()
    .sum('client_transactions.base_developer_proceeds')
    .from('client_transactions')
    .where(function () {
      this.where({
        'client_transactions.account_id': account_id,
        'client_transactions.application_id': application_id,
      })

      if (filter?.from && filter?.to) {
        this.andWhereBetween('event_date', [
          dayjs(filter.from).format('YYYY-MM-DD'),
          dayjs(filter.to).format('YYYY-MM-DD'),
        ])
      }
    })
    .first()

  return parseFloat(sum).toFixed(2)
}
