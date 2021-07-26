import test from 'ava'
import { randomUUID } from 'crypto'
import grpc from '@grpc/grpc-js'

import { getRandomPort, getClients, promisifyAll } from './client.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg/index.js'
import * as AccountModel from '../src/pg/accounts.js'

const port = getRandomPort()
const { accounts, memberships } = getClients(port)
const Accounts = promisifyAll(accounts)
const Memberships = promisifyAll(memberships)

test.before(async (t) => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${port}`)
})

test.after.always(async (t) => {
  await app.close()
  await pg.destroy()
})

test('Accounts.findOrCreate should create a new integration', async (t) => {
  const identity_id = randomUUID()

  const response = await Memberships.findOrCreate({
    identity_id,
    name: 'Hello World',
  })

  t.teardown(() =>
    pg.transaction((trx) =>
      AccountModel.destroy({ account_id: response.account_id }, trx),
    ),
  )

  t.truthy(response)
  t.truthy(response.account_id)
  t.is(response.identity_id, identity_id)
})

test('Accounts.findAll should return empty array on not found', async (t) => {
  const response = await Accounts.findAll({ identity_id: randomUUID() })
  t.deepEqual(response, { rows: [] })
})

test('Accounts.findAll should return all accounts associated with me', async (t) => {
  const identity_id = randomUUID()

  const membership = await Memberships.findOrCreate({
    identity_id,
    name: 'Hello World',
  })

  t.teardown(() =>
    pg.transaction((trx) =>
      AccountModel.destroy({ account_id: membership.account_id }, trx),
    ),
  )

  t.truthy(membership.account_id)
  t.is(membership.identity_id, identity_id)

  const my_accounts = await Accounts.findAll({ identity_id })

  for (const row of my_accounts.rows) {
    t.is(row.owner_identity_id, identity_id)
    t.is(row.account_id, membership.account_id)
  }
})

test('Accounts.update should return error on not found', async (t) => {
  try {
    await Accounts.update({
      account_id: randomUUID(),
      identity_id: randomUUID(),
      name: 'hola',
    })
    throw new Error('Invalid')
  } catch (error) {
    t.not(error.message, 'Invalid')
    t.is(error.code, grpc.status.NOT_FOUND)
  }
})

test('Accounts.update should update an account', async (t) => {
  const identity_id = randomUUID()
  const membership = await Memberships.findOrCreate({
    identity_id,
    name: 'hello world',
  })

  t.teardown(() =>
    pg.transaction((trx) =>
      AccountModel.destroy({ account_id: membership.account_id }, trx),
    ),
  )
  t.is(membership.identity_id, identity_id)
  t.truthy(membership.account_id.length)

  await Accounts.update({
    account_id: membership.account_id,
    identity_id,
    name: 'hola',
  })

  const {
    rows: [account],
  } = await Accounts.findAll({ identity_id })

  t.is(account.name, 'hola')
  t.is(account.account_id, membership.account_id)
  t.is(account.owner_identity_id, membership.identity_id)
})

test('AccountsfindMembers should return error on not found', async (t) => {
  try {
    await Accounts.findMembers({ account_id: randomUUID() })
    throw new Error('Invalid')
  } catch (error) {
    t.not(error.message, 'Invalid')
    t.is(error.code, grpc.status.NOT_FOUND)
  }
})

test('Accounts.addMember should return error on not found', async (t) => {
  try {
    await Accounts.addMember({
      account_id: randomUUID(),
      identity_id: randomUUID(),
    })
    throw new Error('Invalid')
  } catch (error) {
    t.not(error.message, 'Invalid')
    t.is(error.code, grpc.status.NOT_FOUND)
  }
})

test('Accounts.removeMember should return error on not found', async (t) => {
  try {
    await Accounts.removeMember({
      account_id: randomUUID(),
      identity_id: randomUUID(),
    })
    throw new Error('Invalid')
  } catch (error) {
    t.not(error.message, 'Invalid')
    t.is(error.code, grpc.status.NOT_FOUND)
  }
})
