import { randomUUID } from 'crypto'
import grpc from '@grpc/grpc-js'

import { getRandomPort, getClients } from './client.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg/index.js'
import * as Accounts from '../src/pg/accounts.js'

const port = getRandomPort()
const { accounts, memberships } = getClients(port)

beforeAll(async () => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${port}`)
})

afterAll(async () => {
  await app.close()
  await pg.destroy()
})

describe('Memberships', () => {
  test('findOrCreate should create a new integration', (done) => {
    const identity_id = randomUUID()
    memberships.findOrCreate(
      { identity_id, name: 'Hello World' },
      async (error, response) => {
        expect(error).toBeFalsy()
        expect(response).toBeTruthy()
        expect(response.account_id).toBeTruthy()
        expect(response.identity_id).toEqual(identity_id)

        await pg.transaction((trx) =>
          Accounts.destroy({ account_id: response.account_id }, trx),
        )
        done()
      },
    )
  })
})

describe('Accounts', () => {
  test('findAll should return empty array on not found', (done) => {
    accounts.findAll({ identity_id: randomUUID() }, (error, response) => {
      expect(error).toBeFalsy()
      expect(response).toEqual({ rows: [] })
      done()
    })
  })
  test('update should return error on not found', (done) => {
    accounts.update(
      { account_id: randomUUID(), identity_id: randomUUID(), name: 'hola' },
      (error) => {
        expect(error).toBeTruthy()
        expect(error.code).toEqual(grpc.status.NOT_FOUND)
        done()
      },
    )
  })

  test('findMembers should return error on not found', (done) => {
    accounts.findMembers({ account_id: randomUUID() }, (error) => {
      expect(error).toBeTruthy()
      expect(error.code).toEqual(grpc.status.NOT_FOUND)
      done()
    })
  })

  test('addMember should return error on not found', (done) => {
    accounts.addMember(
      { account_id: randomUUID(), identity_id: randomUUID() },
      (error) => {
        expect(error).toBeTruthy()
        expect(error.code).toEqual(grpc.status.NOT_FOUND)
        done()
      },
    )
  })

  test('removeMember should return error on not found', (done) => {
    accounts.removeMember(
      { account_id: randomUUID(), identity_id: randomUUID() },
      (error) => {
        expect(error).toBeTruthy()
        expect(error.code).toEqual(grpc.status.NOT_FOUND)
        done()
      },
    )
  })
})
