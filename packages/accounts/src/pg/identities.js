import pg from './index.js'

export async function findAccounts({ identity_id }) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'a.account_id',
      account_name: 'a.name',
      owner_identity_id: 'a.owner_identity_id',
      created_at: 'a.created_at',
    })
    .from('accounts AS a')
    .join('memberships AS m', 'm.account_id', 'a.account_id')
    .where('m.identity_id', identity_id)
}
