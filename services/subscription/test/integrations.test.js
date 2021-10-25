import { v4 } from 'uuid'

import pg from '../src/pg/index.js'
import { getClients, getRandomPort } from './helper.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'

const testedAccountId = '15b0dea9-d2f8-4eed-a0ff-fecac3fdcf33'
const testedAccessToken = 'f4965faa-0374-42a9-988b-6e6f2a2aeac2'

const port = getRandomPort()
const grpc = getClients(port)

beforeAll(async () => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${port}`)
})

afterAll(async () => {
  await app.close()
  await pg.destroy()
})

describe('Integrations', () => {
  test('validate', (done) => {
    grpc.integrations.validate(
      {
        access_token: v4(),
      },
      (error, response) => {
        expect(error).toBeFalsy()
        expect(typeof response).toEqual('object')
        expect(response.state).toBeFalsy()
        done()
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
        expect(error).toBeFalsy()
        expect(response).toStrictEqual({ row: null })
        done()
      },
    )
  })

  test('findAll', (done) => {
    const account_id = v4()
    grpc.integrations.findAll(
      {
        account_id,
      },
      (error, response) => {
        expect(error).toBeFalsy()
        expect(Array.isArray(response.rows)).toBeTruthy()
        response.rows.forEach((r) => expect(r.account_id).toEqual(account_id))
        done()
      },
    )
  })

  test('upsert', (done) => {
    grpc.integrations.upsert(
      {
        account_id: '58e670db-f4ee-407d-979e-3e0d88c8eeb8',
        provider_id: 'apple',
        access_token: testedAccessToken,
      },
      (error, response) => {
        expect(error).toBeFalsy()
        expect(response).toStrictEqual({ state: true })
        done()
      },
    )
  })

  test('upsert should create an integration if not exist', (done) => {
    grpc.integrations.upsert(
      {
        account_id: testedAccountId,
        provider_id: 'apple',
        access_token: testedAccessToken,
      },
      (error, response) => {
        expect(error).toBeFalsy()
        expect(response).toStrictEqual({ state: true })

        grpc.integrations.findAll(
          { account_id: testedAccountId },
          (error, response) => {
            expect(error).toBeFalsy()
            expect(Array.isArray(response.rows)).toBeTruthy()

            response.rows.forEach((r) =>
              expect(r.account_id).toEqual(testedAccountId),
            )

            const newly = response.rows.find(
              (r) => r.access_token === testedAccessToken,
            )
            expect(newly).toBeTruthy()
            expect(newly.provider_id).toEqual('apple')
            done()
          },
        )
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
        expect(error).toBeFalsy()
        expect(response).toStrictEqual({ state: true })
        done()
      },
    )
  })
})
