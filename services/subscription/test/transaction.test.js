import test from 'ava'

import dayjs from 'dayjs'

import Transaction from '../src/models/transaction.js'

import { WITH_FREE_TRIAL, exchange_rates, REFUND, STANDARD } from './mocks.js'

test('should parse free trial correctly', (t) => {
  const transaction = new Transaction(WITH_FREE_TRIAL, exchange_rates)
  t.is(transaction.type, 'trial')
  t.falsy(transaction.subscription_refunded_at)
  t.truthy(transaction.duration)
})

test('should parse refund correctly', (t) => {
  const transaction = new Transaction(REFUND, exchange_rates)
  t.is(transaction.type, 'refund')
  t.is(transaction.subscriber_purchase, transaction.developer_proceeds)
  t.is(transaction.purchase_date?.format('YYYY-MM-DD'), REFUND.purchaseDate)
})

test('should parse renewal correctly', (t) => {
  const transaction = new Transaction(STANDARD, exchange_rates)
  transaction.total_base_developer_proceeds = '9.99'
  t.is(transaction.type, 'renewal')
  t.falsy(transaction.subscription_refunded_at)
  t.truthy(transaction.duration)
  t.is(transaction.subscription_expired_at.format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'))
})
