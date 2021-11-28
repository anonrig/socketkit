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
      report_id: 'subscribers',
      account_id: TEST_ACCOUNT_ID,
      interval: '1 week',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
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
      report_id: 'customer-lifetime-value',
      account_id: TEST_ACCOUNT_ID,
      interval: '1 week',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
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
      report_id: 'trials',
      account_id: TEST_ACCOUNT_ID,
      interval: '1 week',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
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
      report_id: 'average-sales-cycle',
      account_id: TEST_ACCOUNT_ID,
      interval: '1 week',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
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
      report_id: 'subscriptions',
      account_id: TEST_ACCOUNT_ID,
      interval: '1 week',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
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
      report_id: 'average-revenue-per-subscription',
      account_id: TEST_ACCOUNT_ID,
      interval: '1 week',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
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
      report_id: 'sales-refunds',
      account_id: TEST_ACCOUNT_ID,
      interval: '1 week',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
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
      report_id: 'average-sale',
      account_id: TEST_ACCOUNT_ID,
      interval: '1 week',
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
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
