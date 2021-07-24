import pg from './index.js'

export async function findAll({ identity_id }) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'a.account_id',
      name: 'a.name',
      owner_identity_id: 'a.owner_identity_id',
      created_at: 'a.created_at',
    })
    .from('memberships AS m')
    .join('accounts AS a', 'a.account_id', 'm.account_id')
    .where('m.identity_id', identity_id)
}

export async function findOne({ account_id }) {
  return pg
    .queryBuilder()
    .select('*')
    .from('accounts')
    .where({ account_id })
    .first()
}

export async function update({ identity_id, account_id, name }, trx) {
  return pg
    .queryBuilder()
    .update({ name })
    .where({ owner_identity_id: identity_id, account_id })
    .from('accounts')
    .transacting(trx)
}

export async function destroy({ account_id }, trx) {
  await pg
    .queryBuilder()
    .delete()
    .from('memberships')
    .where({ account_id })
    .transacting(trx)

  await pg
    .queryBuilder()
    .delete()
    .from('accounts')
    .where({ account_id })
    .transacting(trx)
}
