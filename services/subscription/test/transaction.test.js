import dayjs from 'dayjs'
import Transaction from '../src/models/transaction.js'

const WITH_FREE_TRIAL = {
  country: 'US',
  customerPrice: '0.00',
  developerProceeds: '0.00',
  subscriptionOfferDuration: '3 Days',
  standardSubscriptionDuration: '1 Month',
}
const REFUND = {
  country: 'US',
  refund: 'Yes',
  purchaseDate: dayjs().format('YYYY-MM-DD'),
  customerPrice: '-9.99',
  developerProceeds: '9.99',
  standardSubscriptionDuration: '1 Month',
}
const STANDARD = {
  country: 'US',
  customerPrice: '-9.99',
  developerProceeds: '9.99',
  customerCurrency: 'USD',
  proceedsCurrency: 'USD',
  standardSubscriptionDuration: '1 Week',
  eventDate: dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
}

const exchange_rates = {
  USD: 1,
}

describe('Transaction', () => {
  test('should parse free trial correctly', (done) => {
    const t = new Transaction(WITH_FREE_TRIAL, exchange_rates)
    expect(t.type).toEqual('trial')
    expect(t.subscription_refunded_at).toBeFalsy()
    expect(t.duration).toBeTruthy()
    done()
  })

  test('should parse refund correctly', (done) => {
    const t = new Transaction(REFUND, exchange_rates)
    expect(t.type).toEqual('refund')
    expect(t.subscriber_purchase).toEqual(t.developer_proceeds)
    expect(t.purchase_date?.format('YYYY-MM-DD')).toEqual(REFUND.purchaseDate)
    done()
  })

  test('should parse renewal correctly', (done) => {
    const t = new Transaction(STANDARD, exchange_rates)
    t.total_base_developer_proceeds = '9.99'
    expect(t.type).toEqual('renewal')
    expect(t.subscription_refunded_at).toBeFalsy()
    expect(t.duration).toBeTruthy()
    expect(t.subscription_expired_at.format('YYYY-MM-DD')).toEqual(
      dayjs().format('YYYY-MM-DD'),
    )
    done()
  })
})
