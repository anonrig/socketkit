import { v4 } from 'uuid'

import { getRandomPort, getClients } from './client.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg.js'
import grpc from '@grpc/grpc-js'

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
  describe('Slack', () => {
    test('should validate input', (done) => {
      notification.send(
        { account_id: v4(), provider_id: 'slack' },
        (error, response) => {
          expect(error).toBeTruthy()
          expect(error.message).toContain('Integration not found')
          expect(response).toBeFalsy()
          done()
        },
      )
    })
  })
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

    test('should validate account_id', (done) => {
      integration.findAll({ account_id: 'ahmet' }, (error, response) => {
        expect(error).toBeTruthy()
        expect(error.code).toEqual(grpc.status.FAILED_PRECONDITION)
        expect(error.message).toContain('Account id is invalid')
        expect(response).toBeFalsy()
        done()
      })
    })
  })

  describe('upsert', () => {
    test('should validate account_id', (done) => {
      integration.upsert({ account_id: 'ahmet' }, (error, response) => {
        expect(error).toBeTruthy()
        expect(error.code).toEqual(grpc.status.FAILED_PRECONDITION)
        expect(error.message).toContain('Account id is invalid')
        expect(response).toBeFalsy()
        done()
      })
    })
  })

  describe('destroy', () => {
    test('should validate account_id', (done) => {
      integration.destroy({ account_id: 'ahmet' }, (error, response) => {
        expect(error).toBeTruthy()
        expect(error.code).toEqual(grpc.status.FAILED_PRECONDITION)
        expect(error.message).toContain('Account id is invalid')
        expect(response).toBeFalsy()
        done()
      })
    })
  })
})
