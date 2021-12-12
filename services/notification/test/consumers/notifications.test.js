import { randomUUID } from 'crypto'
import { promisify } from 'util'

import test from 'ava'

import app from '../../src/grpc.js'
import pg from '../../src/pg.js'

import { getRandomPort, getClients } from '../client.js'
import { removeIntegration } from '../models.js'

test.before(async (t) => {
  const port = getRandomPort()
  Object.assign(t.context, getClients(port))
  await app.start(`0.0.0.0:${port}`)
})

test.after(async () => {
  await app.close()
  await pg.destroy()
})

test('send should validate input', async (t) => {
  const { notifications } = t.context
  const send = promisify(notifications.send).bind(notifications)

  try {
    await send({ account_id: randomUUID(), properties: [], provider_id: 'slack' })
    throw new Error('should not be here')
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.true(error.message.endsWith('Integration not found'), `${error.message}`)
  }
})

test('send should succeed with valid integration', async (t) => {
  const account_id = randomUUID()
  const { integrations, notifications } = t.context
  const upsert = promisify(integrations.upsert).bind(integrations)
  const send = promisify(notifications.send).bind(notifications)

  await upsert({
    account_id,
    provider_id: 'slack',
    requirement: {
      url: 'https://google.com',
    },
  })
  t.teardown(() => removeIntegration({ account_id, provider_id: 'slack' }))

  t.deepEqual(await send({ account_id, properties: [], provider_id: 'slack' }), {})
})
