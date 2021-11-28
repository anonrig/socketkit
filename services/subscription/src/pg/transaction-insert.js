import pg from './index.js'

export default async function insertTransaction(transaction, { account_id }, trx) {
  let subscription = await pg
    .queryBuilder()
    .transacting(trx)
    .from('subscriptions')
    .where({
      account_id,
      subscriber_id: transaction.subscriber_id,
      subscription_package_id: transaction.subscription_package_id,
    })
    .andWhere(function () {
      this.whereRaw('active_period @> ?::date', [transaction.event_date]).orWhere(
        'subscription_expired_at',
        transaction.event_date,
      )

      if (transaction.purchase_date) {
        this.orWhereRaw(`active_period && daterange(?, ?)`, [
          transaction.purchase_date,
          transaction.event_date,
        ])
      }
    })
    .select(['subscription_started_at', 'total_base_developer_proceeds'])
    .orderBy('subscription_expired_at', 'DESC')
    .forUpdate()
    .first()

  if (!subscription) {
    await pg
      .queryBuilder()
      .insert({
        account_id,
        application_id: transaction.application_id,
        free_trial_duration: transaction.free_trial_duration,
        subscriber_id: transaction.subscriber_id,
        subscription_expired_at: transaction.event_date,
        subscription_package_id: transaction.subscription_package_id,
        subscription_started_at: transaction.event_date,
      })
      .into('subscriptions')
      .transacting(trx)

    transaction.subscription_started_at = transaction.event_date
    transaction.total_base_developer_proceeds = 0
  } else {
    transaction.subscription_started_at = subscription.subscription_started_at
    transaction.total_base_developer_proceeds = subscription.total_base_developer_proceeds
  }

  await pg
    .queryBuilder()
    .insert({
      account_id,
      application_id: transaction.application_id,
      base_currency_id: transaction.base_currency_id,
      base_developer_proceeds: transaction.base_developer_proceeds,
      base_subscriber_purchase: transaction.base_subscriber_purchase,
      developer_currency_id: transaction.developer_currency_id,
      developer_proceeds: transaction.developer_proceeds,
      event_date: transaction.event_date,
      subscriber_currency_id: transaction.subscriber_currency_id,
      subscriber_id: transaction.subscriber_id,
      subscriber_purchase: transaction.subscriber_purchase,
      subscription_package_id: transaction.subscription_package_id,
      subscription_started_at: transaction.subscription_started_at,
      transaction_type: transaction.type,
    })
    .into('transactions')
    .transacting(trx)

  await pg
    .queryBuilder()
    .transacting(trx)
    .from('subscriptions')
    .where({
      account_id,
      subscriber_id: transaction.subscriber_id,
      subscription_package_id: transaction.subscription_package_id,
      subscription_started_at: transaction.subscription_started_at,
    })
    .update({
      subscription_expired_at: transaction.subscription_expired_at,
      subscription_refunded_at: transaction.purchase_date,
      total_base_developer_proceeds:
        transaction.total_base_developer_proceeds + transaction.base_developer_proceeds,
    })
}
