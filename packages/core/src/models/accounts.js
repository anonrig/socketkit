import pg from '../pg.js'
import { v4 } from 'uuid'

export async function getAccounts({ identity_id }) {
  return pg
    .queryBuilder()
    .select('account_id')
    .from('account_identities')
    .where({ identity_id })
}

export async function createAccount({ identity_id }) {
  return pg
    .queryBuilder()
    .insert({
      account_role: 'owner',
      created_at: new Date(),
      account_id: v4(),
      identity_id,
    })
    .into('account_identities')
    .returning('*')
}
