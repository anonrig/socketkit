import dayjs from 'dayjs'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg/index.js'
import { getClients, getRandomPort } from './helper.js'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`

const port = getRandomPort()
const grpc = getClients(port)

beforeAll(async () => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${port}`)
})

afterAll(async () => {
  await app.close()
  await pg.destroy()
})

describe('Reports', () => {
  test('subscribers', (done) => {
    grpc.reports.get(
      {
        report_id: 'subscribers',
        account_id: TEST_ACCOUNT_ID,
        interval: '1 week',
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach(({ x, y0 }) => {
          expect(x).toHaveLength(10)
          expect(y0).toBeGreaterThanOrEqual(0)
        })
        done()
      },
    )
  })

  test('customer-lifetime-value', (done) => {
    grpc.reports.get(
      {
        report_id: 'customer-lifetime-value',
        account_id: TEST_ACCOUNT_ID,
        interval: '1 week',
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach(({ x, y0 }) => {
          expect(x).toHaveLength(10)
          expect(y0).toBeGreaterThanOrEqual(0)
        })
        done()
      },
    )
  })

  test('trials', (done) => {
    grpc.reports.get(
      {
        report_id: 'trials',
        account_id: TEST_ACCOUNT_ID,
        interval: '1 week',
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach(({ x, y0 }) => {
          expect(x).toHaveLength(10)
          expect(y0).toBeGreaterThanOrEqual(0)
        })
        done()
      },
    )
  })

  test('averageDuration', (done) => {
    grpc.reports.get(
      {
        report_id: 'average-sales-cycle',
        account_id: TEST_ACCOUNT_ID,
        interval: '1 week',
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach(({ x, y0 }) => {
          expect(x).toHaveLength(10)
          expect(y0).toBeGreaterThanOrEqual(0)
        })
        done()
      },
    )
  })

  test('subscriptions', (done) => {
    grpc.reports.get(
      {
        report_id: 'subscriptions',
        account_id: TEST_ACCOUNT_ID,
        interval: '1 week',
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach(({ x, y0 }) => {
          expect(x).toHaveLength(10)
          expect(y0).toBeGreaterThanOrEqual(0)
        })
        done()
      },
    )
  })

  test('averageDuration', (done) => {
    grpc.reports.get(
      {
        report_id: 'average-revenue-per-subscription',
        account_id: TEST_ACCOUNT_ID,
        interval: '1 week',
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach(({ x, y0 }) => {
          expect(x).toHaveLength(10)
          expect(y0).toBeGreaterThanOrEqual(0)
        })
        done()
      },
    )
  })

  test('salesRefunds', (done) => {
    grpc.reports.get(
      {
        report_id: 'sales-refunds',
        account_id: TEST_ACCOUNT_ID,
        interval: '1 week',
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach(({ x, y0 }) => {
          expect(x).toHaveLength(10)
          expect(y0).toBeGreaterThanOrEqual(0)
        })
        done()
      },
    )
  })

  test('averageSale', (done) => {
    grpc.reports.get(
      {
        report_id: 'average-sale',
        account_id: TEST_ACCOUNT_ID,
        interval: '1 week',
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach(({ x, y0 }) => {
          expect(x).toHaveLength(10)
          expect(y0).toBeGreaterThanOrEqual(0)
        })
        done()
      },
    )
  })
})
