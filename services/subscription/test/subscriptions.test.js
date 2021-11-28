/* eslint-disable ava/no-unknown-modifiers */
import test from 'ava'
import dayjs from 'dayjs'

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

test.cb('findPackages', (t) => {
  grpc.subscriptions.findPackages(
    { account_id: TEST_ACCOUNT_ID, application_id: TEST_APPLICATION_ID },
    (error, response) => {
      t.falsy(error)
      t.is(typeof response, 'object')
      t.end()
    },
  )
})

test.cb('groupByApplication', (t) => {
  grpc.subscriptions.groupByApplication(
    {
      account_id: TEST_ACCOUNT_ID,
      application_id: TEST_APPLICATION_ID,
      end_date: dayjs().toString(),
      start_date: dayjs().subtract(1, 'month').toString(),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      t.end()
    },
  )
})

test.cb('groupByCountry', (t) => {
  grpc.subscriptions.groupByCountry(
    {
      account_id: TEST_ACCOUNT_ID,
      application_id: TEST_APPLICATION_ID,
      end_date: dayjs().toString(),
      start_date: dayjs().subtract(1, 'month').toString(),
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.true(Array.isArray(response.rows))
      t.end()
    },
  )
})

test.cb('count', (t) => {
  grpc.subscriptions.count(
    {
      account_id: TEST_ACCOUNT_ID,
      application_id: TEST_APPLICATION_ID,
      end_date: dayjs().toString(),
      start_date: dayjs().subtract(1, 'month').toString(),
    },
    (error, response) => {
      t.falsy(error)
      t.is(response.total, 0)
      t.is(response.total_trial, 0)
      t.is(response.current, 0)
      t.is(response.current_trial, 0)
      t.is(response.at_start, 0)
      t.is(response.at_start_trial, 0)
      t.end()
    },
  )
})
