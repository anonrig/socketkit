import grpc from './helper.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import dayjs from 'dayjs'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`

beforeAll((done) => {
  logger.pauseLogs()
  app.start(`0.0.0.0:${config.port}`)
  done()
})

afterAll(async (done) => {
  await app.close()
  done()
})

describe('Accounts', () => {
  test('statistics', (done) => {
    grpc.accounts.statistics(
      { account_id: TEST_ACCOUNT_ID },
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

  test('findCountries', (done) => {
    grpc.accounts.findCountries(
      {
        account_id: TEST_ACCOUNT_ID,
        start_date: dayjs().subtract(1, 'month').toString(),
        end_date: dayjs().toString(),
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response.rows).toBeInstanceOf(Array)
          expect(response.rows[0].country_id).toBeDefined()
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})
