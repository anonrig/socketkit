import { v4 } from 'uuid'

import { notification, integration } from './client.js'
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
  describe('findAll', () => {
    test('should return valid response', (done) => {
      integration.findAll(
        {
          account_id: v4(),
        },
        (error, response) => {
          try {
            expect(error).toBeNull()
            expect(response.rows).toBeInstanceOf(Array)
            expect(response.rows.length).toBeGreaterThanOrEqual(0)
            done()
          } catch (error) {
            done(error)
          }
        },
      )
    })
  })
})
