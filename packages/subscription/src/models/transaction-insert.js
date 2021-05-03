import * as CurrencyExchange from './currency-exchange.js'
import pg from '../pg.js'
import dayjs from 'dayjs'

export async function parseTransaction(transaction, { account_id }, trx) {
  const application_id = transaction.appAppleId
  const client_id = transaction.subscriberId
  const client_currency_id = transaction.customerCurrency
  const developer_currency_id = transaction.proceedsCurrency
  const event_date = transaction.eventDate
  const base_currency_id = 'USD'

  const [clientCurrencyRate, developerCurrencyRate] = await Promise.all([
    CurrencyExchange.findByPk({
      currency_id: client_currency_id,
      exchange_date: event_date,
    }),
    CurrencyExchange.findByPk({
      currency_id: developer_currency_id,
      exchange_date: event_date,
    }),
  ])

  const customerPrice = transaction.customerPrice
    ? parseFloat(transaction.customerPrice)
    : null
  let developerProceeds = transaction.developerProceeds
    ? parseFloat(transaction.developerProceeds)
    : null

  let subscription = await pg
    .queryBuilder()
    .transacting(trx)
    .from('subscriptions')
    .where({
      account_id,
      subscription_package_id: transaction.subscriptionAppleId,
      client_id,
    })
    .andWhere(function () {
      this.whereRaw('active_period @> ?::date', [event_date])
      this.orWhere('subscription_expired_at', event_date)
      if (!!transaction.purchaseDate)
        this.orWhereRaw(`active_period && daterange(?, ?)`, [
          transaction.purchaseDate,
          event_date,
        ])
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
        subscription_package_id: transaction.subscriptionAppleId,
        client_id,
        subscription_started_at: event_date,
        subscription_expired_at: event_date,
        free_trial_duration:
          transaction.subscriptionOfferDuration ?? '00:00:00',
        application_id,
      })
      .into('subscriptions')
      .transacting(trx)

    subscription = {
      subscription_started_at: event_date,
      total_base_developer_proceeds: 0,
    }
  }

  let transaction_type
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
      event_date: event_date,
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
      subscription_started_at: subscription.subscription_started_at,
    })
    .into('transactions')
    .transacting(trx)
}
