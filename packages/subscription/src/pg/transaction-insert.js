import _ from 'lodash'
import dayjs from 'dayjs'

import pg from './index.js'

export default async function insertTransaction(
  transaction,
  { account_id },
  trx,
) {
  let subscription = await pg
    .queryBuilder()
    .transacting(trx)
    .from('subscriptions')
    .where({
      subscription_package_id: transaction.subscription_package_id,
      subscriber_id: transaction.subscriber_id,
      account_id,
    })
    .andWhere(function () {
      this.whereRaw('active_period @> ?::date', [
        transaction.event_date.format('YYYY-MM-DD'),
      ]).orWhere(
        'subscription_expired_at',
        transaction.event_date.format('YYYY-MM-DD'),
      )

      if (!!transaction.purchase_date) {
        this.orWhereRaw(`active_period && daterange(?, ?)`, [
          transaction.purchase_date.format('YYYY-MM-DD'),
          transaction.event_date.format('YYYY-MM-DD'),
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
        subscription_package_id: transaction.subscription_package_id,
        subscriber_id: transaction.subscriber_id,
        free_trial_duration: transaction.free_trial_duration,
        application_id: transaction.application_id,
        subscription_started_at: transaction.event_date.format('YYYY-MM-DD'),
        subscription_expired_at: transaction.event_date.format('YYYY-MM-DD'),
        account_id,
      })
      .into('subscriptions')
      .transacting(trx)

    transaction.subscription_started_at = transaction.event_date
    transaction.total_base_developer_proceeds = 0
  } else {
    transaction.subscription_started_at = dayjs(
      subscription.subscription_started_at,
    )
    transaction.total_base_developer_proceeds =
      subscription.total_base_developer_proceeds
  }

  await pg
    .queryBuilder()
    .insert({
      event_date: transaction.event_date.format('YYYY-MM-DD'),
      subscriber_purchase: transaction.subscriber_purchase,
      developer_proceeds: transaction.developer_proceeds,
      base_subscriber_purchase: transaction.base_subscriber_purchase,
      base_developer_proceeds: transaction.base_developer_proceeds,
      subscriber_id: transaction.subscriber_id,
      application_id: transaction.application_id,
      subscriber_currency_id: transaction.subscriber_currency_id,
      developer_currency_id: transaction.developer_currency_id,
      subscription_package_id: transaction.subscription_package_id,
      subscription_started_at:
        transaction.subscription_started_at.format('YYYY-MM-DD'),
      account_id,
      transaction_type: transaction.type,
      base_currency_id: transaction.base_currency_id,
    })
    .into('transactions')
    .transacting(trx)

  await pg
    .queryBuilder()
    .transacting(trx)
    .from('subscriptions')
    .where({
      account_id,
      subscription_package_id: transaction.subscription_package_id,
      subscriber_id: transaction.subscriber_id,
      subscription_started_at:
        transaction.subscription_started_at.format('YYYY-MM-DD'),
    })
    .update({
      total_base_developer_proceeds:
        transaction.total_base_developer_proceeds +
        transaction.base_developer_proceeds,
      subscription_expired_at:
        transaction.subscription_expired_at.format('YYYY-MM-DD'),
      subscription_refunded_at: transaction.purchase_date?.format('YYYY-MM-DD') ?? null,
    })
}
