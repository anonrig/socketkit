/* eslint-disable ava/no-unknown-modifiers */
import test from 'ava'

import app from '../src/grpc.js'
import pg from '../src/pg/index.js'

import { getRandomPort, getClients } from './helper.js'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`
const TEST_APPLICATION_ID = `1494736719`

const port = getRandomPort()
const grpc = getClients(port)

test.before(async () => {
  await app.start(`0.0.0.0:${port}`)
})

test.after(async () => {
  await app.close()
  await pg.destroy()
})

test.cb('findAll', (t) => {
  grpc.transactions.findAll(
    {
      account_id: TEST_ACCOUNT_ID,
      application_id: TEST_APPLICATION_ID,
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      t.end()
    },
  )
})

test.cb('sum', (t) => {
  grpc.transactions.sum(
    {
      account_id: TEST_ACCOUNT_ID,
      application_id: TEST_APPLICATION_ID,
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response.current_total_base_developer_proceeds)
      t.end()
    },
  )
})
