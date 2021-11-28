export default class RevenueList {
  constructor(current_day) {
    this.application_country_first_day = new Map()
    this.current_day = current_day
  }

  addTransaction(transaction) {
    let country_first_day = this.application_country_first_day.get(transaction.application_id)
    if (!country_first_day) {
      country_first_day = new Map()
      this.application_country_first_day.set(transaction.application_id, country_first_day)
    }

    let first_day = country_first_day.get(transaction.country_id)
    if (!first_day) {
      first_day = this.current_day
      country_first_day.set(transaction.country_id, first_day)
    }

    if (first_day.isAfter(transaction.event_day))
      country_first_day.set(transaction.country_id, transaction.event_day)
    if (first_day.isAfter(transaction.purchase_day))
      country_first_day.set(transaction.country_id, transaction.purchase_day)
  }

  *[Symbol.iterator]() {
    for (const [application_id, country_first_day] of this.application_country_first_day)
      for (const [country_id, first_day] of country_first_day)
        yield { application_id, country_id, first_day }
  }

  get previous_day() {
    return this.current_day.subtract(1, 'day')
  }
}
