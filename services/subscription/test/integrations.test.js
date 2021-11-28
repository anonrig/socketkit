/* eslint-disable ava/no-unknown-modifiers */
import { randomUUID } from 'crypto'

import test from 'ava'

import app from '../src/grpc.js'
import pg from '../src/pg/index.js'

import { getClients, getRandomPort } from './helper.js'

const testedAccessToken = 'f4965faa-0374-42a9-988b-6e6f2a2aeac2'

const port = getRandomPort()
const grpc = getClients(port)

test.before(async () => {
  await app.start(`0.0.0.0:${port}`)
})

test.after(async () => {
  await app.close()
  await pg.destroy()
})

test.cb('validate', (t) => {
  grpc.integrations.validate(
    {
      access_token: randomUUID(),
    },
    (error, response) => {
      t.falsy(error)
      t.deepEqual(response, { state: false })
      t.end()
    },
  )
})

test.cb('findOne', (t) => {
  grpc.integrations.findOne(
    {
      account_id: randomUUID(),
      provider_id: 'apple',
    },
    (error, response) => {
      t.falsy(error)
      t.deepEqual(response, { row: null })
      t.end()
    },
  )
})

test.cb('findAll', (t) => {
  const account_id = randomUUID()
  grpc.integrations.findAll({ account_id }, (error, response) => {
    t.falsy(error)
    t.true(Array.isArray(response.rows))
    response.rows.forEach((r) => t.is(r.account_id, account_id))
    t.end()
  })
})

test.cb('upsert', (t) => {
  grpc.integrations.upsert(
    {
      access_token: testedAccessToken,
      account_id: '58e670db-f4ee-407d-979e-3e0d88c8eeb8',
      provider_id: 'apple',
    },
    (error, response) => {
      t.falsy(error)
      t.deepEqual(response, { state: true })
      t.end()
    },
  )
})

test.cb('destroy', (t) => {
  grpc.integrations.destroy(
    {
      account_id: randomUUID(),
      provider_id: 'apple',
    },
    (error, response) => {
      t.falsy(error)
      t.deepEqual(response, { state: true })
      t.end()
    },
  )
})
