import { randomUUID } from 'node:crypto'

import pg from '../pg.js'

export function getAccounts({ identity_id }) {
  return pg
    .queryBuilder()
    .select('account_id')
    .from('account_identities')
    .where({ identity_id })
    .orderBy('created_at')
}

export async function findOrCreate({ identity_id }) {
  return pg.transaction(async (trx) => {
    const existing = await getAccounts({ identity_id }).transacting(trx)

    if (existing.length > 0) {
      return existing
    }

    await createAccount({ identity_id }).transacting(trx).onConflict('identity_id').ignore()

    return getAccounts({ identity_id }).transacting(trx)
  })
}

export function createAccount({ identity_id }) {
  return pg
    .queryBuilder()
    .insert({
      account_id: randomUUID(),
      account_role: 'owner',
      created_at: new Date(),
      identity_id,
    })
    .into('account_identities')
}
