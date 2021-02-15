import grpc from './helper.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import { v4 } from 'uuid'

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

describe('Integrations', () => {
  test('validate', (done) => {
    grpc.integrations.validate(
      {
        access_token: v4(),
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.state).toBeDefined()
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('findLatestScrape', (done) => {
    grpc.integrations.findLatestScrape(
      {
        account_id: TEST_ACCOUNT_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.fetch_date).toBeDefined()
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})
