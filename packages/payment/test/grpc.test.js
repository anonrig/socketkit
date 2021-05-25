import { getRandomPort, getClients } from './client.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg.js'

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
    test('should validate account_id', (done) => {
      integration.findOrCreate(
        {
          account_id: 'ahmet',
        },
        (error, response) => {
          expect(error).toBeTruthy()
          expect(error.message).toContain('Invalid account id')
          expect(response).toBeFalsy()
          done()
        },
      )
    })
  })
})
