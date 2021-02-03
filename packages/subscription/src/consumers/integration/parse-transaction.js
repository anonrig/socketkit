import * as Application from '../../models/application.js'
import * as Client from '../../models/client.js'
import * as DeviceType from '../../models/device-type.js'
import * as CurrencyExchange from '../../models/currency-exchange.js'
import * as SubscriptionPackage from '../../models/subscription-package.js'

import pg from '../../pg.js'
import slug from 'slug'
import dayjs from 'dayjs'

export async function parseTransaction(transaction, { account_id }) {
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

  await DeviceType.findOrCreateByPk(
    { device_type_id: slug(transaction.device), provider_id },
    { name: transaction.device },
  )

  await Application.findOrCreateByPk(
    { account_id, application_id },
    { name: transaction.appName, provider_id },
  )

  await Client.findOrCreateByPk(
    { account_id, client_id },
    {
      provider_id,
      device_type_id,
      country_id,
      first_interaction: event_date.format('YYYY-MM-DD'),
      total_base_client_purchase: 0,
      total_base_developer_proceeds: 0,
    },
  )

  await SubscriptionPackage.findOrCreateByPk(
    {
      account_id,
      application_id,
      subscription_group_id: transaction.subscriptionGroupId,
      subscription_package_id: transaction.subscriptionAppleId,
    },
    {
      subscription_duration,
      name: transaction.subscriptionName,
    },
  )

  const customerPrice = transaction.customerPrice
    ? parseFloat(transaction.customerPrice)
    : null
  let developerProceeds = transaction.developerProceeds
    ? parseFloat(transaction.developerProceeds)
    : null
  const isRefund = transaction.refund == 'Yes'
  const isPaying = !isRefund && customerPrice > 0

  if (isRefund && developerProceeds > 0) {
    developerProceeds = developerProceeds * -1
  }

  await pg.transaction(async (trx) => {
    const primaryKeys = {
      account_id,
      subscription_package_id: transaction.subscriptionAppleId,
      client_id,
    }

    const subscription = await trx('client_subscriptions')
      .where(primaryKeys)
      .first()

    if (subscription) {
      if (free_trial_duration) {
        await trx('client_subscriptions')
          .update({ free_trial_duration })
          .where(primaryKeys)
      }
    } else {
      await trx('client_subscriptions')
        .insert({
          ...primaryKeys,
          subscription_duration,
          free_trial_duration: free_trial_duration ?? '00:00:00',
          subscription_group_id: transaction.subscriptionGroupId,
          application_id,
        })
        .onConflict(['account_id', 'subscription_package_id', 'client_id'])
        .ignore()
    }

    await trx('client_transactions')
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
      .onConflict([
        'account_id',
        'client_id',
        'event_date',
        'transaction_type',
        'subscription_group_id',
        'subscription_package_id',
      ])
      .ignore()
  })
}
