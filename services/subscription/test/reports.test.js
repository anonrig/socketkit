/* eslint-disable ava/no-unknown-modifiers */
import test from 'ava'
import dayjs from 'dayjs'

import app from '../src/grpc.js'
import pg from '../src/pg/index.js'

import { getClients, getRandomPort } from './helper.js'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`

const port = getRandomPort()
const grpc = getClients(port)

test.before(async () => {
  await app.start(`0.0.0.0:${port}`)
})

test.after(async () => {
  await app.close()
  await pg.destroy()
})

test.cb('subscribers', (t) => {
  grpc.reports.get(
    {
      account_id: TEST_ACCOUNT_ID,
      end_date: dayjs().format('YYYY-MM-DD'),
      interval: '1 week',
      report_id: 'subscribers',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      response.rows.forEach(({ x, y0 }) => {
        t.is(x.length, 10)
        t.true(y0 >= 0)
      })
      t.end()
    },
  )
})

test.cb('customer-lifetime-value', (t) => {
  grpc.reports.get(
    {
      account_id: TEST_ACCOUNT_ID,
      end_date: dayjs().format('YYYY-MM-DD'),
      interval: '1 week',
      report_id: 'customer-lifetime-value',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      response.rows.forEach(({ x, y0 }) => {
        t.is(x.length, 10)
        t.true(y0 >= 0)
      })
      t.end()
    },
  )
})

test.cb('trials', (t) => {
  grpc.reports.get(
    {
      account_id: TEST_ACCOUNT_ID,
      end_date: dayjs().format('YYYY-MM-DD'),
      interval: '1 week',
      report_id: 'trials',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      response.rows.forEach(({ x, y0 }) => {
        t.is(x.length, 10)
        t.true(y0 >= 0)
      })
      t.end()
    },
  )
})

test.cb('average-sales-cycle', (t) => {
  grpc.reports.get(
    {
      account_id: TEST_ACCOUNT_ID,
      end_date: dayjs().format('YYYY-MM-DD'),
      interval: '1 week',
      report_id: 'average-sales-cycle',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      response.rows.forEach(({ x, y0 }) => {
        t.is(x.length, 10)
        t.true(y0 >= 0)
      })
      t.end()
    },
  )
})

test.cb('subscriptions', (t) => {
  grpc.reports.get(
    {
      account_id: TEST_ACCOUNT_ID,
      end_date: dayjs().format('YYYY-MM-DD'),
      interval: '1 week',
      report_id: 'subscriptions',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      response.rows.forEach(({ x, y0 }) => {
        t.is(x.length, 10)
        t.true(y0 >= 0)
      })
      t.end()
    },
  )
})

test.cb('average-revenue-per-subscription', (t) => {
  grpc.reports.get(
    {
      account_id: TEST_ACCOUNT_ID,
      end_date: dayjs().format('YYYY-MM-DD'),
      interval: '1 week',
      report_id: 'average-revenue-per-subscription',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      response.rows.forEach(({ x, y0 }) => {
        t.is(x.length, 10)
        t.true(y0 >= 0)
      })
      t.end()
    },
  )
})

test.cb('sales-refunds', (t) => {
  grpc.reports.get(
    {
      account_id: TEST_ACCOUNT_ID,
      end_date: dayjs().format('YYYY-MM-DD'),
      interval: '1 week',
      report_id: 'sales-refunds',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      response.rows.forEach(({ x, y0 }) => {
        t.is(x.length, 10)
        t.true(y0 >= 0)
      })
      t.end()
    },
  )
})

test.cb('average-sale', (t) => {
  grpc.reports.get(
    {
      account_id: TEST_ACCOUNT_ID,
      end_date: dayjs().format('YYYY-MM-DD'),
      interval: '1 week',
      report_id: 'average-sale',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      response.rows.forEach(({ x, y0 }) => {
        t.is(x.length, 10)
        t.true(y0 >= 0)
      })
      t.end()
    },
  )
})
