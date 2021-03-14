import pg from '../pg.js'
import { v4 } from 'uuid'

export async function getAccounts({ identity_id }) {
  return pg
    .queryBuilder()
    .select('account_id')
    .from('account_identities')
    .where('identity_id', identity_id)
}

export async function createAccount({ identity_id }) {
  return pg.transaction(async (trx) => {
    const account_id = v4()

    return trx('account_identities')
      .insert({
        account_role: 'owner',
        created_at: new Date(),
        account_id,
        identity_id,
      })
      .transacting(trx)
      .onConflict(['account_id', 'identity_id'])
      .ignore()
      .returning('*')
  })
}
