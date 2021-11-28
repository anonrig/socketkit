import dayjs from 'dayjs'
import dayjsDuration from 'dayjs/plugin/duration.js'

import { parseDuration } from '../helpers.js'
import { ISODate } from '../types.js'

dayjs.extend(dayjsDuration)

export default class Transaction {
  subscriber_exchange = null
  developer_exchange = null

  base_currency_id = 'USD'
  subscription_started_at = null

  // We're using this to have a separate getter and setter
  // to check and maintain the type while setting.
  _total_base_developer_proceeds = 0

  constructor(raw, exchange_rates) {
    this.raw = raw
    this.country_id = raw.country.toLowerCase()
    this.application_id = raw.appAppleId
    this.subscription_package_id = raw.subscriptionAppleId
    this.subscriber_id = raw.subscriberId
    this.subscriber_currency_id = raw.customerCurrency
    this.developer_currency_id = raw.proceedsCurrency
    this.event_date = ISODate.parse(raw.eventDate)
    this.subscriber_purchase = parseFloat(raw.customerPrice)
    this.developer_proceeds = parseFloat(raw.developerProceeds)
    this.purchase_date = raw.purchaseDate ? ISODate.parse(raw.purchaseDate) : null
    this.free_trial_duration = raw.subscriptionOfferDuration ?? '00:00:00'
    this.standard_subscription_duration = raw.standardSubscriptionDuration
    this.subscriber_exchange_rate = exchange_rates[this.subscriber_currency_id]
    this.developer_exchange_rate = exchange_rates[this.developer_currency_id]

    // for refunds the subscriber_purchase is negative but
    // the developer_proceeds is positive.
    if (this.subscriber_purchase < 0 && this.developer_proceeds > 0) {
      this.developer_proceeds = this.developer_proceeds * -1
    }
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
    this._total_base_developer_proceeds = typeof value === 'string' ? parseFloat(value) : value
  }

  get total_base_developer_proceeds() {
    return this._total_base_developer_proceeds
  }

  get subscription_expired_at() {
    return this.event_date.add(this.duration)
  }

  get base_subscriber_purchase() {
    return this.subscriber_purchase / this.subscriber_exchange_rate
  }

  get base_developer_proceeds() {
    return this.developer_proceeds / this.developer_exchange_rate
  }
}
