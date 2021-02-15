import * as CurrencyExchange from '../../models/currency-exchange.js'

import pg from '../../pg.js'
import slug from 'slug'
import dayjs from 'dayjs'

export async function parseTransaction(transaction, { account_id }, trx) {
  const application_id = transaction.appAppleId
  const provider_id = 'apple'
  const client_id = transaction.subscriberId
  const device_type_id = slug(transaction.device)
  const country_id = transaction.country
  const client_currency_id = transaction.customerCurrency
  const developer_currency_id = transaction.proceedsCurrency
  const event_date = dayjs(transaction.eventDate)
  const subscription_duration = transaction.standardSubscriptionDuration
  const free_trial_duration = transaction.subscriptionOfferDuration
  const base_currency_id = 'USD'

  const [clientCurrencyRate, developerCurrencyRate] = await Promise.all([
    CurrencyExchange.findByPk({
      currency_id: client_currency_id,
      exchange_date: event_date.format('YYYY-MM-DD'),
    }),
    CurrencyExchange.findByPk({
      currency_id: developer_currency_id,
      exchange_date: event_date.format('YYYY-MM-DD'),
    }),
  ])

  // create device type id
  await pg
    .insert({
      provider_id,
      device_type_id: slug(transaction.device),
      name: transaction.device,
    })
    .into('device_types')
    .onConflict(['provider_id', 'device_type_id'])
    .ignore()
    .transacting(trx)

  // create client
  await pg
    .insert({
      account_id,
      provider_id,
      client_id,
      device_type_id,
      country_id,
      first_interaction: event_date.format('YYYY-MM-DD'),
      total_base_client_purchase: 0,
      total_base_developer_proceeds: 0,
    })
    .into('clients')
    .onConflict(['account_id', 'client_id'])
    .merge()
    .transacting(trx)

  // create subscription package
  await pg
    .insert({
      account_id,
      application_id,
      subscription_group_id: transaction.subscriptionGroupId,
      subscription_package_id: transaction.subscriptionAppleId,
      subscription_duration,
      name: transaction.subscriptionName,
    })
    .into('subscription_packages')
    .onConflict(['account_id', 'subscription_package_id'])
    .merge()
    .transacting(trx)

  const customerPrice = transaction.customerPrice
    ? parseFloat(transaction.customerPrice)
    : null
  let developerProceeds = transaction.developerProceeds
    ? parseFloat(transaction.developerProceeds)
    : null
  const isRefund = transaction.refund == 'Yes'
  const isPaying = !isRefund && customerPrice > 0

  if (isRefund && developerProceeds && developerProceeds > 0) {
    developerProceeds = developerProceeds * -1
  }

  const primaryKeys = {
    account_id,
    subscription_package_id: transaction.subscriptionAppleId,
    client_id,
  }

  const subscription = await pg
    .queryBuilder()
    .select('*')
    .from('client_subscriptions')
    .where(primaryKeys)
    .first()
    .transacting(trx)

  if (subscription) {
    if (free_trial_duration) {
      await pg
        .queryBuilder()
        .update({ free_trial_duration })
        .from('client_subscriptions')
        .where(primaryKeys)
        .transacting(trx)
    }
  } else {
    await pg
      .queryBuilder()
      .insert({
        ...primaryKeys,
        subscription_duration,
        free_trial_duration: free_trial_duration ?? '00:00:00',
        subscription_group_id: transaction.subscriptionGroupId,
        application_id,
      })
      .into('client_subscriptions')
      .onConflict(['account_id', 'subscription_package_id', 'client_id'])
      .ignore()
      .transacting(trx)
  }

  await pg
    .queryBuilder()
    .insert({
      transaction_type: isPaying ? 'renewal' : isRefund ? 'refund' : 'trial',
      event_date: event_date.format('YYYY-MM-DD'),
      account_id,
      client_purchase: customerPrice,
      developer_proceeds: developerProceeds,
      base_client_purchase:
        customerPrice !== null
          ? customerPrice / clientCurrencyRate.amount
          : null,
      base_developer_proceeds:
        developerProceeds !== null
          ? developerProceeds / developerCurrencyRate.amount
          : null,
      client_id,
      application_id,
      client_currency_id,
      developer_currency_id,
      base_currency_id,
      subscription_package_id: transaction.subscriptionAppleId,
      subscription_group_id: transaction.subscriptionGroupId,
    })
    .into('client_transactions')
    .onConflict([
      'account_id',
      'client_id',
      'event_date',
      'transaction_type',
      'subscription_group_id',
      'subscription_package_id',
    ])
    .ignore()
    .transacting(trx)
}
