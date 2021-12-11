import { randomUUID } from 'crypto'
import { promisify } from 'util'

import test from 'ava'

import app from '../../src/grpc.js'
import pg from '../../src/pg.js'

import { getRandomPort, getClients } from '../client.js'

test.before(async (t) => {
  const port = getRandomPort()
  Object.assign(t.context, getClients(port))
  await app.start(`0.0.0.0:${port}`)
})

test.after(async () => {
  await app.close()
  await pg.destroy()
})

test('findAll should return valid response', async (t) => {
  const { integrations } = t.context
  const findAll = promisify(integrations.findAll).bind(integrations)
  const response = await findAll({ account_id: randomUUID(), provider_id: 'slack' })

  t.true(Array.isArray(response.rows))
  t.true(response.rows.length >= 0)
})
