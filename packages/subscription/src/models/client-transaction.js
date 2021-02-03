import pg from '../pg.js'

export async function count({ account_id, application_id }, { filter }) {
  const { count } = await pg
    .queryBuilder()
    .count()
    .from('client_transactions')
    .where(function () {
      this.where({ account_id })

      if (application_id) {
        this.andWhere('application_id', application_id)
      }

      if (filter?.from && filter?.to) {
        this.andWhereBetween('event_date', [filter.from, filter.to])
      }
    })
    .first()

  return parseInt(count ?? '0')
}

export async function findAll(
  { account_id, application_id },
  { filter, limit = 10, offset = 0 },
) {
  return pg
    .queryBuilder()
    .select({
      client_id: 'client_transactions.client_id',
      transaction_type: 'client_transactions.transaction_type',
      transaction_event_date: 'client_transactions.event_date',
      transaction_base_client_purchase:
        'client_transactions.base_client_purchase',
      transaction_base_developer_proceeds:
        'client_transactions.base_developer_proceeds',
      subscription_package_id: 'client_transactions.subscription_package_id',
      subscription_package_name: 'subscription_packages.name',
      application_id: 'applications.application_id',
      application_name: 'applications.name',
      country_id: 'countries.country_id',
      country_name: 'countries.name',
    })
    .from('client_transactions')
    .innerJoin('applications', function () {
      this.on(
        'client_transactions.application_id',
        'applications.application_id',
      ).andOn('client_transactions.account_id', 'applications.account_id')
    })
    .innerJoin('subscription_packages', function () {
      this.on(
        'subscription_packages.subscription_package_id',
        'client_transactions.subscription_package_id',
      ).andOn(
        'subscription_packages.account_id',
        'client_transactions.account_id',
      )
    })
    .innerJoin('clients', function () {
      this.on('clients.client_id', 'client_transactions.client_id').andOn(
        'clients.account_id',
        'client_transactions.account_id',
      )
    })
    .innerJoin('countries', 'countries.country_id', 'clients.country_id')
    .where(function () {
      this.where('client_transactions.account_id', account_id)

      if (application_id) {
        this.andWhere('applications.application_id', application_id)
      }

      if (filter?.from && filter?.to) {
        this.andWhereBetween('client_transactions.event_date', [
          filter.from,
          filter.to,
        ])
      }
    })
    .limit(limit)
    .offset(offset)
}
