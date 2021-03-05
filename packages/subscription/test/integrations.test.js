import grpc from './helper.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import { v4 } from 'uuid'

beforeAll(async (done) => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${config.port}`)
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
          expect(response.state).toEqual(false)
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('findOne', (done) => {
    grpc.integrations.findOne(
      {
        account_id: v4(),
        provider_id: 'apple',
      },
      (error, response) => {
        try {
          expect(error).toBeFalsy()
          expect(response).toBeDefined()
          expect(response.row).toBeNull()
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('findAll', (done) => {
    grpc.integrations.findAll(
      {
        account_id: v4(),
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response.rows).toBeInstanceOf(Array)
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('destroy', (done) => {
    grpc.integrations.destroy(
      {
        account_id: v4(),
        provider_id: 'apple',
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toStrictEqual({ state: true })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('update', (done) => {
    grpc.integrations.update(
      {
        account_id: v4(),
        access_token: v4(),
      },
      (error) => {
        try {
          expect(error).toBeTruthy()
          expect(error.message).toContain('not found')
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})
