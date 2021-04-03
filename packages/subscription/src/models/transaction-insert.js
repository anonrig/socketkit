import * as CurrencyExchange from './currency-exchange.js'
import pg from '../pg.js'
import dayjs from 'dayjs'

export async function parseTransaction(transaction, { account_id }, trx) {
  const application_id = transaction.appAppleId
  const client_id = transaction.subscriberId
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

  const customerPrice = transaction.customerPrice
    ? parseFloat(transaction.customerPrice)
    : null
  let developerProceeds = transaction.developerProceeds
    ? parseFloat(transaction.developerProceeds)
    : null

  await pg
    .queryBuilder()
    .insert({
      account_id,
      subscription_package_id: transaction.subscriptionAppleId,
      client_id,
      subscription_duration,
      free_trial_duration: free_trial_duration ?? '00:00:00',
      subscription_group_id: transaction.subscriptionGroupId,
      application_id,
    })
    .into('subscriptions')
    .transacting(trx)
    .onConflict(['account_id', 'subscription_package_id', 'client_id'])
    .ignore()

  // This should be .returning() on the previous query, but Knexjs doesn't
  // support it with .onConflict().  TODO: Fix it in Knexjs
  const subscription = await pg
    .queryBuilder()
    .transacting(trx)
    .from('subscriptions')
    .where({
      account_id,
      subscription_package_id: transaction.subscriptionAppleId,
      client_id,
    })
    .select(['total_base_developer_proceeds'])
    .first()

  let transaction_type = null
  if (transaction.refund !== 'Yes') {
    if (customerPrice === 0) {
      transaction_type = 'trial'
    } else {
      if (subscription.total_base_developer_proceeds === 0) {
        transaction_type = 'conversion'
      } else {
        transaction_type = 'renewal'
      }
    }
  } else {
    transaction_type = 'refund'
  }

  if (transaction_type === 'refund' && developerProceeds > 0) {
    developerProceeds = developerProceeds * -1
  }

  await pg
    .queryBuilder()
    .insert({
      transaction_type,
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
    .into('transactions')
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
