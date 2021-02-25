import grpc from './helper.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`
const TEST_APPLICATION_ID = `1494736719`
const TEST_CLIENT_ID = `784408463844217`

beforeAll(async (done) => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${config.port}`)
  done()
})

afterAll(async (done) => {
  await app.close()
  done()
})

describe('Clients', () => {
  test('findAll', (done) => {
    grpc.clients.findAll(
      {
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('findOne', (done) => {
    grpc.clients.findOne(
      {
        account_id: TEST_ACCOUNT_ID,
        client_id: TEST_CLIENT_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeDefined()
          expect(error.message).toContain('Client not found')
          expect(response).toBeUndefined()
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('findTransactions', (done) => {
    grpc.clients.findTransactions(
      {
        account_id: TEST_ACCOUNT_ID,
        client_id: TEST_CLIENT_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('findSubscriptions', (done) => {
    grpc.clients.findSubscriptions(
      {
        account_id: TEST_ACCOUNT_ID,
        client_id: TEST_CLIENT_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})
