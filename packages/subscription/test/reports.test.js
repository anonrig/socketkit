import grpc from './helper.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`
const TEST_APPLICATION_ID = `1494736719`

beforeAll(async (done) => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${config.port}`)
  done()
})

afterAll(async (done) => {
  await app.close()
  done()
})

describe('Reports', () => {
  test('subscribers', (done) => {
    grpc.reports.get(
      { report_id: 'subscribers', account_id: TEST_ACCOUNT_ID },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach(({ x, y0 }) => {
            expect(x).toBeDefined()
            expect(y0).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('trials', (done) => {
    grpc.reports.get(
      {
        report_id: 'trials',
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach(({ x, y0 }) => {
            expect(x).toBeDefined()
            expect(y0).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('averageDuration', (done) => {
    grpc.reports.get(
      {
        report_id: 'average-sales-cycle',
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach(({ x, y0 }) => {
            expect(x).toBeDefined()
            expect(y0).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('subscriptions', (done) => {
    grpc.reports.get(
      {
        report_id: 'subscriptions',
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach(({ x, y0 }) => {
            expect(x).toBeDefined()
            expect(y0).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('averageDuration', (done) => {
    grpc.reports.get(
      {
        report_id: 'average-revenue-per-subscription',
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach(({ x, y0 }) => {
            expect(x).toBeDefined()
            expect(y0).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('salesRefunds', (done) => {
    grpc.reports.get(
      {
        report_id: 'sales-refunds',
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach(({ x, y0 }) => {
            expect(x).toBeDefined()
            expect(y0).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('averageSale', (done) => {
    grpc.reports.get(
      {
        report_id: 'average-sale',
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach(({ x, y0 }) => {
            expect(x).toBeDefined()
            expect(y0).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})
