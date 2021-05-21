import { integration } from './client.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'

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
