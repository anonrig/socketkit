import grpc from './helper.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import { v4 } from 'uuid'

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
})
