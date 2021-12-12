import { randomUUID } from 'crypto'
import { promisify } from 'util'

import test from 'ava'
import faker from 'faker'

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

test('findAll should return valid response', async (t) => {
  const { integrations } = t.context
  const findAll = promisify(integrations.findAll).bind(integrations)
  const response = await findAll({ account_id: randomUUID(), provider_id: 'slack' })

  t.true(Array.isArray(response.rows))
  t.true(response.rows.length >= 0)
})

test('upsert should create a slack integration', async (t) => {
  const account_id = randomUUID()
  const { integrations } = t.context
  const upsert = promisify(integrations.upsert).bind(integrations)
  const findAll = promisify(integrations.findAll).bind(integrations)
  const upsert_response = await upsert({
    account_id,
    provider_id: 'slack',
    requirement: {
      url: 'https://google.com',
    },
  })
  t.teardown(() => removeIntegration({ account_id, provider_id: 'slack' }))
  t.deepEqual(upsert_response, {})
  const find_response = await findAll({ account_id, provider_id: 'slack' })
  t.truthy(find_response)
  t.true(Array.isArray(find_response.rows))
  t.truthy(find_response.rows.find((r) => r.provider_id === 'slack' && r.account_id === account_id))
})

test('upsert should create a discord integration', async (t) => {
  const account_id = randomUUID()
  const { integrations } = t.context
  const upsert = promisify(integrations.upsert).bind(integrations)
  const findAll = promisify(integrations.findAll).bind(integrations)
  const upsert_response = await upsert({
    account_id,
    provider_id: 'discord',
    requirement: {
      url: 'https://google.com',
    },
  })
  t.teardown(() => removeIntegration({ account_id, provider_id: 'discord' }))
  t.deepEqual(upsert_response, {})
  const find_response = await findAll({ account_id, provider_id: 'discord' })
  t.truthy(find_response)
  t.true(Array.isArray(find_response.rows))
  t.truthy(find_response.rows.find((r) => r.provider_id === 'discord' && r.account_id === account_id))
})

test('upsert should create an email integration', async (t) => {
  const account_id = randomUUID()
  const { integrations } = t.context
  const upsert = promisify(integrations.upsert).bind(integrations)
  const findAll = promisify(integrations.findAll).bind(integrations)
  const upsert_response = await upsert({
    account_id,
    provider_id: 'email',
    requirement: {
      email: faker.internet.email().toLowerCase(),
    },
  })
  t.teardown(() => removeIntegration({ account_id, provider_id: 'email' }))
  t.deepEqual(upsert_response, {})
  const find_response = await findAll({ account_id, provider_id: 'email' })
  t.truthy(find_response)
  t.true(Array.isArray(find_response.rows))
  t.truthy(find_response.rows.find((r) => r.provider_id === 'email' && r.account_id === account_id))
})

test('destroy should remove an integration', async (t) => {
  const account_id = randomUUID()
  const { integrations } = t.context
  const destroy = promisify(integrations.destroy).bind(integrations)
  const upsert = promisify(integrations.upsert).bind(integrations)
  const findAll = promisify(integrations.findAll).bind(integrations)

  await upsert({
    account_id,
    provider_id: 'slack',
    requirement: {
      url: 'https://google.com',
    },
  })
  t.teardown(() => removeIntegration({ account_id, provider_id: 'slack' }))

  const find_response = await findAll({ account_id, provider_id: 'slack' })
  t.truthy(find_response)
  t.true(Array.isArray(find_response.rows))
  t.truthy(find_response.rows.find((r) => r.provider_id === 'slack' && r.account_id === account_id))

  const destroy_response = await destroy({ account_id, provider_id: 'slack' })
  t.deepEqual(destroy_response, {})

  t.deepEqual(await findAll({ account_id, provider_id: 'slack' }), { rows: [] })
})
