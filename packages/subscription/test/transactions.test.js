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

describe('Transactions', () => {
  test('findAll', (done) => {
    grpc.transactions.findAll(
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

  test('sum', (done) => {
    grpc.transactions.sum(
      {
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
      },
      (error, response) => {
        expect(error).toBeNull()
        expect(response.current_total_base_developer_proceeds).toBeDefined()
        done()
      },
    )
  })
})
