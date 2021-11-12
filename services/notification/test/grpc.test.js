import { randomUUID } from 'crypto'
import test from 'ava'

import { getRandomPort, getClients } from './client.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg.js'

const port = getRandomPort()
const { notification, integration } = getClients(port)

test.before(async () => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${port}`)
})

test.after(async () => {
  await app.close()
  await pg.destroy()
})

test.cb('Notifications.send should validate input', (t) => {
  t.plan(3)

  notification.send(
    { account_id: randomUUID(), provider_id: 'slack' },
    (error, response) => {
      t.truthy(error)
      t.truthy(error.message.includes('Integration not found'))
      t.falsy(response)
      t.end()
    },
  )
})

test.cb('Integrations.findAll should return valid response', (t) => {
  t.plan(3)

  integration.findAll(
    { account_id: randomUUID(), provider_id: 'slack' },
    (error, response) => {
      t.is(error, null)
      t.true(Array.isArray(response.rows))
      t.true(response.rows.length >= 0)
      t.end()
    },
  )
})
