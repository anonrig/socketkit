import dayjs from 'dayjs'

import { getRandomPort, getClients } from './helper.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg/index.js'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`
const TEST_APPLICATION_ID = `1494736719`

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

describe('Subscriptions', () => {
  test('findPackages', (done) => {
    grpc.subscriptions.findPackages(
      { account_id: TEST_ACCOUNT_ID, application_id: TEST_APPLICATION_ID },
      (error, response) => {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        done()
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
        expect(error).toBeNull()
        expect(response.rows).toBeInstanceOf(Array)
        done()
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
        expect(error).toBeNull()
        expect(response.rows).toBeInstanceOf(Array)
        done()
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
        expect(error).toBeNull()
        expect(response.total).toBeDefined()
        done()
      },
    )
  })
})
