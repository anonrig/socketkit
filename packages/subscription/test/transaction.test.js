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
  standardSubscriptionDuration: '1 Month',
}

describe('Transaction', () => {
  test('should parse free trial correctly', async (done) => {
    const t = new Transaction(WITH_FREE_TRIAL)
    const rates = await t.getExchangeRates()
    expect(t.type).toEqual('trial')
    expect(rates).toEqual([{ amount: 0 }, { amount: 0 }])
    expect(t.subscription_refunded_at).toBeFalsy()
    expect(t.duration).toBeTruthy()
    done()
  })

  test('should parse refund correctly', (done) => {
    const t = new Transaction(REFUND)
    expect(t.type).toEqual('refund')
    expect(t.subscriber_purchase).toEqual(t.developer_proceeds)
    expect(t.subscription_refunded_at).toEqual(REFUND.purchaseDate)
    done()
  })

  test('should parse renewal correctly', async (done) => {
    const t = new Transaction(STANDARD)
    await t.getExchangeRates()
    t.total_base_developer_proceeds = '9.99'
    expect(t.type).toEqual('renewal')
    expect(t.subscription_refunded_at).toBeFalsy()
    expect(t.duration).toBeTruthy()
    done()
  })
})
