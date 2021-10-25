import dayjs from 'dayjs'
import pg from './index.js'

export async function findOrCreate({ owner_identity_id, account_name }, trx) {
  const integration = await pg
    .queryBuilder()
    .select('*')
    .from('memberships')
    .where({ identity_id: owner_identity_id })
    .transacting(trx)
    .forUpdate()
    .first()

  if (integration) {
    // Update last active at of each membership
    await pg
      .queryBuilder()
      .update({ last_active_at: dayjs().toDate() })
      .from('memberships')
      .where({ identity_id: owner_identity_id })
      .transacting(trx)

    return integration
  }

  const [{ account_id }] = await pg
    .queryBuilder()
    .insert({ name: account_name, owner_identity_id })
    .into('accounts')
    .transacting(trx)
    .returning('*')

  const [new_integration] = await pg
    .queryBuilder()
    .transacting(trx)
    .insert({ identity_id: owner_identity_id, account_id })
    .into('memberships')
    .returning('*')

  return new_integration
}

export async function findAll({ identity_id }) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'a.account_id',
      account_name: 'a.name',
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
    .select({
      account_id: 'account_id',
      account_name: 'name',
      owner_identity_id: 'owner_identity_id',
      created_at: 'created_at',
    })
    .from('accounts')
    .where({ account_id })
    .first()
}

export async function update({ identity_id, account_id, account_name }, trx) {
  return pg
    .queryBuilder()
    .update({ name: account_name })
    .where({ owner_identity_id: identity_id, account_id })
    .from('accounts')
    .transacting(trx)
}

export async function findMembers({ account_id }) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'account_id',
      identity_id: 'identity_id',
      created_at: 'created_at',
      last_active_at: 'last_active_at',
    })
    .from('memberships')
    .where({ account_id })
}

export async function removeMember({ account_id, identity_id }, trx) {
  return pg
    .queryBuilder()
    .delete()
    .from('memberships')
    .where({ account_id, identity_id })
    .transacting(trx)
}

export async function destroy({ account_id }, trx) {
  await pg
    .queryBuilder()
    .delete()
    .from('invitations')
    .where({ account_id })
    .transacting(trx)

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
