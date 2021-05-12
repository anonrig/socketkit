import dayjs from 'dayjs'
import dayjsDuration from 'dayjs/plugin/duration.js'
import _ from 'lodash'
import * as CurrencyExchange from './currency-exchange.js'
import { parseDuration } from '../helpers.js'

dayjs.extend(dayjsDuration)

export default class Transaction {
  subscriber_exchange = null
  developer_exchange = null

  base_currency_id = 'USD'
  subscription_started_at = null

  // we're using this to have a seperate getter and setter
  // to check and manipulate the type while setting
  _total_base_developer_proceeds = 0

  constructor(raw) {
    this.raw = raw
    this.application_id = raw.appAppleId
    this.subscription_package_id = raw.subscriptionAppleId
    this.subscriber_id = raw.subscriberId
    this.subscriber_currency_id = raw.customerCurrency
    this.developer_currency_id = raw.proceedsCurrency
    this.event_date = raw.eventDate
    this.subscriber_purchase = parseFloat(raw.customerPrice)
    this.developer_proceeds = parseFloat(raw.developerProceeds)
    this.purchase_date = raw.purchaseDate
    this.free_trial_duration = raw.subscriptionOfferDuration ?? '00:00:00'
    this.standard_subscription_duration = raw.standardSubscriptionDuration
    this.country_id = raw.country

    // for refunds the subscriber_purchase is negative but
    // the developer_proceeds is positive.
    if (this.subscriber_purchase < 0 && this.developer_proceeds > 0) {
      this.developer_proceeds = this.developer_proceeds * -1
    }
  }

  async getExchangeRates() {
    if (this.type === 'trial') {
      return [{ amount: 0 }, { amount: 0 }]
    }

    if (this.subscriber_exchange && this.developer_exchange) {
      return [this.subscriber_exchange, this.developer_exchange]
    }

    // the exchange rate is always 1 if subscriber currency is same as base currency id
    if (this.subscriber_currency_id === this.base_currency_id) {
      this.subscriber_exchange = this.developer_exchange = { amount: 1 }
    } else if (this.subscriber_currency_id === this.developer_currency_id) {
      const unified = await CurrencyExchange.findByPk({
        currency_id: this.subscriber_currency_id,
        exchange_date: this.event_date,
      })

      this.subscriber_exchange = this.developer_exchange = unified
    } else {
      const [subscriber_exchange, developer_exchange] = await Promise.all([
        CurrencyExchange.findByPk({
          currency_id: this.subscriber_currency_id,
          exchange_date: this.event_date,
        }),
        CurrencyExchange.findByPk({
          currency_id: this.developer_currency_id,
          exchange_date: this.event_date,
        }),
      ])
      this.subscriber_exchange = subscriber_exchange
      this.developer_exchange = developer_exchange
    }

    return [this.subscriber_exchange, this.developer_exchange]
  }

  get type() {
    if (this.raw.refund !== 'Yes') {
      if (this.subscriber_purchase === 0) {
        return 'trial'
      } else {
        if (this.total_base_developer_proceeds === 0) {
          return 'conversion'
        } else {
          return 'renewal'
        }
      }
    } else {
      return 'refund'
    }
  }

  get duration() {
    return dayjs.duration(
      this.type === 'refund'
        ? {}
        : this.type === 'trial'
        ? parseDuration(this.free_trial_duration)
        : parseDuration(this.standard_subscription_duration),
    )
  }

  set total_base_developer_proceeds(value) {
    this._total_base_developer_proceeds =
      typeof value === 'string' ? parseFloat(value) : value
  }

  get total_base_developer_proceeds() {
    return this._total_base_developer_proceeds
  }

  get subscription_expired_at() {
    return dayjs(this.event_date).add(this.duration).format('YYYY-MM-DD')
  }

  get subscription_refunded_at() {
    return this.type === 'refund' ? this.purchase_date : null
  }

  get base_subscriber_purchase() {
    if (this.type === 'trial') return 0
    else if (this.subscriber_exchange === null)
      throw new Error(`Please call Transaction.getExchangeRates first`)
    else if (this.subscriber_exchange.amount === 0) return 0
    else return this.subscriber_purchase / this.subscriber_exchange.amount
  }

  get base_developer_proceeds() {
    if (this.type === 'trial') return 0
    else if (this.developer_exchange === null)
      throw new Error(`Please call Transaction.getExchangeRates first`)
    else if (this.developer_exchange.amount === 0) return 0
    else return this.developer_proceeds / this.developer_exchange.amount
  }

  get base_developer_proceeds_as_mrr() {
    if (this.base_developer_proceeds === 0) return 0
    const duration = this.standard_subscription_duration
      .toLowerCase()
      .split(' ')
    const [period, interval] = [parseInt(duration[0]), duration[1]]

    if (interval.includes('week')) {
      return (this.base_developer_proceeds / period) * 4
    } else if (interval.includes('month')) {
      return (this.base_developer_proceeds / period) * 1
    } else if (interval.includes('year')) {
      return this.base_developer_proceeds / period / 12
    } else {
      throw new Error(
        `Unhandled duration caught ${this.standard_subscription_duration}`,
      )
    }
  }
}
