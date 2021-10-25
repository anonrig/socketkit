import { randomUUID } from 'crypto'

import { getRandomPort, getClients } from './client.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg.js'

const port = getRandomPort()
const { notification, integration } = getClients(port)

beforeAll(async () => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${port}`)
})

afterAll(async () => {
  await app.close()
  await pg.destroy()
})

describe('Notifications', () => {
  test('send should validate input', (done) => {
    notification.send(
      { account_id: randomUUID(), provider_id: 'slack' },
      (error, response) => {
        expect(error).toBeTruthy()
        expect(error.message).toContain('Integration not found')
        expect(response).toBeFalsy()
        done()
      },
    )
  })
})

describe('Integrations', () => {
  test('findAll should return valid response', (done) => {
    integration.findAll(
      { account_id: randomUUID(), provider_id: 'slack' },
      (error, response) => {
        expect(error).toBeNull()
        expect(response.rows).toBeInstanceOf(Array)
        expect(response.rows.length).toBeGreaterThanOrEqual(0)
        done()
      },
    )
  })
})
