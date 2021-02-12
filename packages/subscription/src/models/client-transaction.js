import pg from '../pg.js'

export async function findAll(
  { account_id, application_id, client_id },
  { filter, limit = 10, cursor },
) {
  return pg
    .queryBuilder()
    .select({
      client_id: 'client_transactions.client_id',
      transaction_type: 'client_transactions.transaction_type',
      event_date: 'client_transactions.event_date',
      base_client_purchase: 'client_transactions.base_client_purchase',
      base_developer_proceeds: 'client_transactions.base_developer_proceeds',
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
    .where('client_transactions.account_id', account_id)
    .andWhere(function () {
      if (application_id?.length) {
        this.andWhere('applications.application_id', application_id)
      }

      if (client_id?.length) {
        this.andWhere('client_transactions.client_id', client_id)
      }

      if (cursor) {
        const { client_id, event_date } = cursor

        if (!client_id || !event_date) {
          throw new Error(`Invalid cursor for pagination`)
        }

        this.andWhereRaw('client_transactions.event_date < ?', [event_date])
        this.andWhereRaw('client_transactions.client_id < ?', [client_id])
      }

      if (filter?.from && filter?.to) {
        this.andWhereBetween('client_transactions.event_date', [
          filter.from,
          filter.to,
        ])
      }
    })
    .orderByRaw(
      `client_transactions.event_date desc, client_transactions.client_id desc`,
    )
    .limit(limit)
}
