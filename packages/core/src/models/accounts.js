import pg from '../pg.js'
import { v4 } from 'uuid'

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

    await createAccount({ identity_id })
      .transacting(trx)
      .onConflict('identity_id')
      .ignore()

    return getAccounts({ identity_id }).transacting(trx)
  })
}

export function createAccount({ identity_id }) {
  return pg
    .queryBuilder()
    .insert({
      account_role: 'owner',
      created_at: new Date(),
      account_id: v4(),
      identity_id,
    })
    .into('account_identities')
}
