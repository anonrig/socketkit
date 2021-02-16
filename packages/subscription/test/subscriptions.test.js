import grpc from './helper.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import dayjs from 'dayjs'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`
const TEST_APPLICATION_ID = `1494736719`

beforeAll((done) => {
  logger.pauseLogs()
  app.start(`0.0.0.0:${config.port}`)
  done()
})

afterAll(async (done) => {
  await app.close()
  done()
})

describe('Applications', () => {
  test('findPackages', (done) => {
    grpc.subscriptions.findPackages(
      { account_id: TEST_ACCOUNT_ID, application_id: TEST_APPLICATION_ID },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('groupByApplication', (done) => {
    grpc.subscriptions.groupByApplication(
      {
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
        start_date: dayjs().subtract(1, 'month').toString(),
        end_date: dayjs().toString(),
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response.rows).toBeInstanceOf(Array)
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('groupByCountry', (done) => {
    grpc.subscriptions.groupByCountry(
      {
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
        start_date: dayjs().subtract(1, 'month').toString(),
        end_date: dayjs().toString(),
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response.rows).toBeInstanceOf(Array)
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('count', (done) => {
    grpc.subscriptions.count(
      {
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
        start_date: dayjs().subtract(1, 'month').toString(),
        end_date: dayjs().toString(),
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response.total).toBeDefined()
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})
