export default class RevenueList {
  constructor(current_day) {
    this.country_first_day = new Map()
    this.current_day = current_day
  }

  addTransaction(transaction) {
    if (!this.country_first_day.has(transaction.country_id))
      this.country_first_day.set(transaction.country_id, this.current_day)
    if (
      this.country_first_day
        .get(transaction.country_id)
        .isAfter(transaction.event_day)
    )
      this.country_first_day.set(transaction.country_id, transaction.event_day)
    if (
      this.country_first_day
        .get(transaction.country_id)
        .isAfter(transaction.purchase_day)
    )
      this.country_first_day.set(
        transaction.country_id,
        transaction.purchase_day,
      )
  }

  *[Symbol.iterator]() {
    for (const [country_id, first_day] of this.country_first_day)
      yield { country_id, first_day }
  }

  get previous_day() {
    return this.current_day.subtract(1, 'day')
  }
}
