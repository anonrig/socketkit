import pg from '../../pg.js'

export default async function getTransactionsById({ client_id, account_id }) {
  return pg
    .select({
      application_id: 'client_transactions.application_id',
      application_name: 'applications.name',
      transaction_type: 'client_transactions.transaction_type',
      subscription_package_id: 'client_transactions.subscription_package_id',
      subscription_package_name: 'subscription_packages.name',
      transaction_event_date: 'client_transactions.event_date',
      transaction_base_client_purchase:
        'client_transactions.base_client_purchase',
      transaction_base_developer_proceeds:
        'client_transactions.base_developer_proceeds',
    })
    .from('client_transactions')
    .where('client_transactions.client_id', client_id)
    .andWhere('client_transactions.account_id', account_id)
    .join('applications', function () {
      this.using(['application_id', 'account_id'])
    })
    .join('subscription_packages', function () {
      this.using(['subscription_package_id', 'account_id'])
    })
    .join('client_subscriptions', function () {
      this.using(['client_id', 'subscription_package_id', 'account_id'])
    })
}
