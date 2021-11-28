import test from 'ava'

import app from '../src/grpc.js'
import pg from '../src/pg/index.js'
import { getRandomPort, getClients } from './helper.js'

const TEST_ACCOUNT_ID = `58e670db-f4ee-407d-979e-3e0d88c8eeb8`
const TEST_APPLICATION_ID = `1494736719`
const TEST_SUBSCRIBER_ID = `784408463844217`

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
  grpc.subscribers.findAll(
    {
      account_id: TEST_ACCOUNT_ID,
      application_id: TEST_APPLICATION_ID,
    },
    (error, response) => {
      t.is(error, null)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      t.end()
    },
  )
})

test.cb('findOne', (t) => {
  grpc.subscribers.findOne(
    {
      account_id: TEST_ACCOUNT_ID,
      subscriber_id: TEST_SUBSCRIBER_ID,
    },
    (error, response) => {
      t.truthy(error)
      t.true(error.message.includes('Subscriber not found'))
      t.falsy(response)
      t.end()
    },
  )
})

test.cb('findTransactions', (t) => {
  grpc.subscribers.findTransactions(
    {
      account_id: TEST_ACCOUNT_ID,
      subscriber_id: TEST_SUBSCRIBER_ID,
    },
    (error, response) => {
      t.is(error, null)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      t.end()
    },
  )
})

test.cb('findSubscriptions', (t) => {
  grpc.subscribers.findSubscriptions(
    {
      account_id: TEST_ACCOUNT_ID,
      subscriber_id: TEST_SUBSCRIBER_ID,
    },
    (error, response) => {
      t.is(error, null)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      t.end()
    },
  )
})
