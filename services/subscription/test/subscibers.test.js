import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg/index.js'
import { getRandomPort, getClients } from './helper.js'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`
const TEST_APPLICATION_ID = `1494736719`
const TEST_SUBSCRIBER_ID = `784408463844217`

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

describe('Subscribers', () => {
  test('findAll', (done) => {
    grpc.subscribers.findAll(
      {
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        done()
      },
    )
  })

  test('findOne', (done) => {
    grpc.subscribers.findOne(
      {
        account_id: TEST_ACCOUNT_ID,
        subscriber_id: TEST_SUBSCRIBER_ID,
      },
      (error, response) => {
        expect(error).toBeDefined()
        expect(error.message).toContain('Subscriber not found')
        expect(response).toBeUndefined()
        done()
      },
    )
  })

  test('findTransactions', (done) => {
    grpc.subscribers.findTransactions(
      {
        account_id: TEST_ACCOUNT_ID,
        subscriber_id: TEST_SUBSCRIBER_ID,
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        done()
      },
    )
  })

  test('findSubscriptions', (done) => {
    grpc.subscribers.findSubscriptions(
      {
        account_id: TEST_ACCOUNT_ID,
        subscriber_id: TEST_SUBSCRIBER_ID,
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        done()
      },
    )
  })
})
