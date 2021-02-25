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
  test('trials', (done) => {
    grpc.reports.trials(
      { account_id: TEST_ACCOUNT_ID, application_id: TEST_APPLICATION_ID },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.available_filters).toBeInstanceOf(Object)
          expect(response.available_filters.length > 0).toBeTruthy()
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach(({ primary, secondary }) => {
            expect(primary).toBeDefined()
            expect(secondary).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('averageDuration', (done) => {
    grpc.reports.averageDuration(
      { account_id: TEST_ACCOUNT_ID, application_id: TEST_APPLICATION_ID },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.available_filters).toBeInstanceOf(Object)
          expect(response.available_filters.length > 0).toBeTruthy()
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach(({ primary }) => {
            expect(primary).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})
