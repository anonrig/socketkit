import pg from '../../pg.js'

export default async function getTransactionsById({ client_id, account_id }) {
  return pg
    .select({
      application_id: 't.application_id',
      transaction_type: 't.transaction_type',
      subscription_package_id: 't.subscription_package_id',
      subscription_package_name: 'p.name',
      event_date: 't.event_date',
      base_client_purchase: 't.base_client_purchase',
      base_developer_proceeds: 't.base_developer_proceeds',
    })
    .from('transactions as t')
    .where('t.client_id', client_id)
    .andWhere('t.account_id', account_id)
    .join('subscription_packages as p', function () {
      this.using([
        'account_id',
        'subscription_package_id',
      ])
    })
}
