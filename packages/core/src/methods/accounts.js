import pg from '../pg.js'
import { v4 } from 'uuid'

export async function getAccounts({ identity_id }) {
  return pg
    .queryBuilder()
    .select({ account_id: 'account_identities.account_id' })
    .from('account_identities')
    .innerJoin('accounts', function () {
      this.on('account_identities.account_id', 'accounts.account_id')
    })
    .where(function () {
      this.where('account_identities.identity_id', identity_id)
    })
}

export async function createAccount({ identity_id }) {
  return pg.transaction(async (trx) => {
    const account_id = v4()
    await trx('accounts')
      .insert({ account_id })
      .returning('account_id')
      .transacting(trx)

    await trx('account_identities')
      .insert({
        account_role: 'owner',
        created_at: new Date(),
        account_id,
        identity_id,
      })
      .transacting(trx)
      .onConflict(['account_id', 'identity_id'])
      .ignore()
  })
}
