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

test('send should validate input', async (t) => {
  const { notifications } = t.context
  const send = promisify(notifications.send).bind(notifications)

  try {
    await send({ account_id: randomUUID(), properties: [], provider_id: 'slack' })
    throw new Error('should not be here')
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.true(error.message.endsWith('Integration not found'), error.message)
  }
})
