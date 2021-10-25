import { v4 } from 'uuid'
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
      const account_id = 'ahmet'
      integration.findOrCreate({ account_id }, (error, response) => {
        expect(error).toBeTruthy()
        expect(error.message).toContain('Invalid account id')
        expect(error.message).toContain('FAILED_PRECONDITION')
        expect(response).toBeFalsy()
        done()
      })
    })

    test('should continue on valid account_id', (done) => {
      const account_id = v4()
      integration.findOrCreate({ account_id }, (error, response) => {
        expect(error).toBeFalsy()
        expect(typeof response).toEqual('object')
        expect(response.account_id).toEqual(account_id)
        expect(response.state).toEqual('new')
        done()
      })
    })
  })
})
