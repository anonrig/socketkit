import pg from '../pg.js'
import { v4 } from 'uuid'

export async function getAccounts({ identity_id }) {
  return pg
    .queryBuilder()
    .select('account_id')
    .from('account_identities')
    .where({ identity_id })
    .orderBy('account_id')
}

export async function createAccount({ identity_id }) {
  return pg.transaction(async (trx) => {
    const account_id = v4()

    await pg
      .queryBuilder()
      .insert({ account_id })
      .into('accounts')
      .transacting(trx)
      .returning('account_id')

    return pg
      .queryBuilder()
      .insert({
        account_role: 'owner',
        created_at: new Date(),
        account_id,
        identity_id,
      })
      .into('account_identities')
      .returning('*')
      .transacting(trx)
  })
}

export async function getAccountIdentities({ account_ids }) {
  return pg
    .queryBuilder()
    .select('*')
    .from('account_identities')
    .whereIn('account_id', account_ids)
    .orderBy('created_at')
}
