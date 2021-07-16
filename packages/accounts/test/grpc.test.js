import { randomUUID } from 'crypto'
import { getRandomPort, getClients } from './client.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg/index.js'

const port = getRandomPort()
const { integration } = getClients(port)

beforeAll(async () => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${port}`)
})

afterAll(async () => {
  await app.close()
  await pg.destroy()
})

describe('Integrations', () => {
  describe('findOrCreate', () => {
    test('should create a new integration', (done) => {
      const identity_id = randomUUID()
      integration.findOrCreate({ identity_id }, (error, response) => {
        expect(error).toBeFalsy()
        expect(response).toBeTruthy()
        expect(response.account_id).toBeTruthy()
        done()
      })
    })
  })
})
