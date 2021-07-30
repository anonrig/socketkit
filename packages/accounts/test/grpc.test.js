import test from 'ava'
import { randomUUID } from 'crypto'
import faker from 'faker'
import grpc from '@grpc/grpc-js'

import { createAccount } from './actions.js'
import { getRandomPort, getClients, promisifyAll } from './client.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'
import pg from '../src/pg/index.js'
import * as Account from '../src/pg/accounts.js'

const port = getRandomPort()
const { accounts, identities } = getClients(port)
const Accounts = promisifyAll(accounts)
const Identities = promisifyAll(identities)

test.before(async (t) => {
  logger.pauseLogs()
  await app.start(`0.0.0.0:${port}`)
})

test.after.always(async (t) => {
  await app.close()
  await pg.destroy()
})

test('Accounts.findOrCreate should create a new integration', async (t) => {
  const response = await createAccount(Accounts, t)
  t.truthy(response)
  t.truthy(response.account_id)
  t.truthy(response.identity_id)
})

test('Accounts.findInvitations should return array', async (t) => {
  const response = await Accounts.findInvitations({ account_id: randomUUID() })
  t.deepEqual(response, { rows: [] })
})

test('Accounts.findInvitations should return invitations', async (t) => {
  const email = faker.internet.email()
  const { account_id } = await createAccount(Accounts, t)
  await Accounts.invite({ account_id, email })

  const { rows: invitations } = await Accounts.findInvitations({ account_id })
  invitations.forEach((invitation) => {
    t.deepEqual(invitation.email, email)
    t.deepEqual(invitation.account_id, account_id)
  })
})

test('Accounts.update should update name', async (t) => {
  const { identity_id, account_id } = await createAccount(Accounts, t)

  await Accounts.update({
    account_id,
    account_name: 'hello world',
    identity_id: identity_id,
  })

  const { rows: accounts } = await Identities.findAccounts({
    identity_id: identity_id,
  })

  accounts.forEach((account) => {
    t.is(account.owner_identity_id, identity_id)
    t.is(account.account_name, 'hello world')
    t.is(account.account_id, account_id)
  })
})

test('Accounts.invite should invite', async (t) => {
  const email = faker.internet.email()
  const { account_id } = await createAccount(Accounts, t)
  await Accounts.invite({ email, account_id })
  const { rows: invitations } = await Accounts.findInvitations({ account_id })

  invitations.forEach((invitation) => {
    t.deepEqual(invitation.email, email)
  })
})

test('Accounts.findMembers should find members', async (t) => {
  const newMember = randomUUID()
  const email = faker.internet.email()
  const { account_id, identity_id } = await createAccount(Accounts, t)
  await Accounts.invite({ email, account_id })
  await Identities.acceptInvitation({
    identity_id: newMember,
    email,
    account_id,
  })

  const { rows: members } = await Accounts.findMembers({ account_id })
  members.forEach((member) => {
    t.truthy([identity_id, newMember].includes(member.identity_id))
    t.deepEqual(member.account_id, account_id)
  })
})

test('Accounts.removeMember should remove a member', async (t) => {
  const newMember = randomUUID()
  const email = faker.internet.email()
  const { account_id, identity_id } = await createAccount(Accounts, t)
  await Accounts.invite({ email, account_id })
  await Identities.acceptInvitation({
    identity_id: newMember,
    email,
    account_id,
  })

  await Accounts.removeMember({ account_id, identity_id: newMember })
  const { rows: members } = await Accounts.findMembers({ account_id })
  members.forEach((member) => {
    t.deepEqual(member.identity_id, identity_id)
    t.deepEqual(member.account_id, account_id)
  })
})

test('Identities.findAccounts should find all accounts', async (t) => {
  const { account_id, identity_id } = await createAccount(Accounts, t)
  const { rows: accounts } = await Identities.findAccounts({ identity_id })

  accounts.forEach((account) => {
    t.is(account.owner_identity_id, identity_id)
    t.is(account.account_id, account_id)
  })
})

test('Identities.findInvitations should return empty array if not found', async (t) => {
  const { rows: invitations } = await Identities.findInvitations({
    email: faker.internet.email(),
  })
  t.deepEqual(invitations, [])
})

test('Identities.findInvitations should find invitations', async (t) => {
  const email = faker.internet.email()
  const { account_id, identity_id } = await createAccount(Accounts, t)
  await Accounts.invite({ email, account_id })

  const { rows: invitations } = await Identities.findInvitations({ email })
  invitations.forEach((invitation) => {
    t.is(invitation.email, email)
    t.is(invitation.account_id, account_id)
  })
})

test('Invitations.acceptInvitation should accept an invitation', async (t) => {
  const newUser = randomUUID()
  const email = faker.internet.email()
  const { account_id } = await createAccount(Accounts, t)
  await Accounts.invite({ email, account_id })
  await Identities.acceptInvitation({ email, identity_id: newUser, account_id })
  const { rows: invitations } = await Identities.findInvitations({ email })
  t.deepEqual(invitations, [])
  const { rows: accounts } = await Identities.findAccounts({
    identity_id: newUser,
  })
  accounts.forEach((account) => {
    t.is(account.account_id, account_id)
  })
})

test('Identities.rejectInvitation should reject an invitation', async (t) => {
  const email = faker.internet.email()
  const { account_id } = await createAccount(Accounts, t)
  await Accounts.invite({ email, account_id })
  await Identities.rejectInvitation({ email, account_id })
  const { rows: invitations } = await Identities.findInvitations({ email })
  t.deepEqual(invitations, [])
})
