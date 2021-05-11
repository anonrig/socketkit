import * as CurrencyExchange from './currency-exchange.js'
import pg from '../pg.js'
import dayjs from 'dayjs'
import dayjs_duration from 'dayjs/plugin/duration.js'

dayjs.extend(dayjs_duration)

export async function parseTransaction(transaction, { account_id }, trx) {
  const application_id = transaction.appAppleId
  const subscription_package_id = transaction.subscriptionAppleId
  const subscriber_id = transaction.subscriberId
  const subscriber_currency_id = transaction.customerCurrency
  const developer_currency_id = transaction.proceedsCurrency
  const event_date = transaction.eventDate
  const base_currency_id = 'USD'
  const subscriber_purchase = parseFloat(transaction.customerPrice)
  let developer_proceeds = parseFloat(transaction.developerProceeds)
  let subscription_started_at
  let total_base_developer_proceeds

  // TODO: Not call this when the amounts are 0
  const [subscriberCurrencyRate, developerCurrencyRate] = await Promise.all([
    CurrencyExchange.findByPk({
      currency_id: subscriber_currency_id,
      exchange_date: event_date,
    }),
    CurrencyExchange.findByPk({
      currency_id: developer_currency_id,
      exchange_date: event_date,
    }),
  ])

  let subscription = await pg
    .queryBuilder()
    .transacting(trx)
    .from('subscriptions')
    .where({
      account_id,
      subscription_package_id,
      subscriber_id,
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
        subscription_package_id,
        subscriber_id,
        subscription_started_at: event_date,
        subscription_expired_at: event_date,
        free_trial_duration:
          transaction.subscriptionOfferDuration ?? '00:00:00',
        application_id,
      })
      .into('subscriptions')
      .transacting(trx)

    subscription_started_at = event_date
    total_base_developer_proceeds = 0
  } else {
    subscription_started_at = subscription.subscription_started_at
    total_base_developer_proceeds = subscription.total_base_developer_proceeds

    // JavaScript driver doesn't detect negative numbers as numbers.
    if (typeof total_base_developer_proceeds !== 'number')
      total_base_developer_proceeds = parseFloat(total_base_developer_proceeds)
  }

  let transaction_type
  if (transaction.refund !== 'Yes') {
    if (subscriber_purchase === 0) {
      transaction_type = 'trial'
    } else {
      if (total_base_developer_proceeds === 0) {
        transaction_type = 'conversion'
      } else {
        transaction_type = 'renewal'
      }
    }
  } else {
    transaction_type = 'refund'
  }

  if (transaction_type === 'refund' && developer_proceeds > 0) {
    developer_proceeds = developer_proceeds * -1
  }

  const base_subscriber_purchase =
    subscriber_purchase / subscriberCurrencyRate.amount
  const base_developer_proceeds =
    developer_proceeds / developerCurrencyRate.amount

  await pg
    .queryBuilder()
    .insert({
      transaction_type,
      event_date: event_date,
      account_id,
      subscriber_purchase,
      developer_proceeds,
      base_subscriber_purchase,
      base_developer_proceeds,
      subscriber_id,
      application_id,
      subscriber_currency_id,
      developer_currency_id,
      base_currency_id,
      subscription_package_id,
      subscription_started_at,
    })
    .into('transactions')
    .transacting(trx)

  await pg
    .queryBuilder()
    .transacting(trx)
    .from('subscriptions')
    .where({
      account_id,
      subscription_package_id,
      subscriber_id,
      subscription_started_at,
    })
    .update({
      total_base_developer_proceeds:
        total_base_developer_proceeds + base_developer_proceeds,
      subscription_expired_at: dayjs(event_date)
        .add(
          dayjs.duration(
            transaction_type === 'refund'
              ? {}
              : transaction_type === 'trial'
              ? parseDuration(transaction.subscriptionOfferDuration)
              : parseDuration(transaction.standardSubscriptionDuration),
          ),
        )
        .format('YYYY-MM-DD'),
      subscription_refunded_at:
        transaction_type === 'refund' ? transaction.purchaseDate : null,
    })
}

function parseDuration(input) {
  let output = {}
  let value = null
  for (const elem of input.split(' ')) {
    if (value === null) {
      value = parseInt(elem)
    } else {
      output[elem] = value
      value = null
    }
  }

  return output
}
