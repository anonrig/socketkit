import pg from './index.js'

export async function findOrCreate({ identity_id, name }, trx) {
  const integration = await pg
    .queryBuilder()
    .transacting(trx)
    .select('*')
    .from('memberships')
    .where({ identity_id })
    .forUpdate()
    .first()

  if (integration) {
    // Update last active at of each membership
    await pg
      .queryBuilder()
      .update({ last_active_at: dayjs().toDate() })
      .from('memberships')
      .where({ identity_id })
      .transacting(trx)

    return integration
  }

  const [{ account_id }] = await pg
    .queryBuilder()
    .insert({ name, owner_identity_id: identity_id })
    .into('accounts')
    .transacting(trx)
    .returning('*')

  const [new_integration] = await pg
    .queryBuilder()
    .transacting(trx)
    .insert({ identity_id, account_id })
    .into('memberships')
    .returning('*')

  return new_integration
}

export async function findMembers({ account_id }) {
  return pg.queryBuilder().select('*').from('memberships').where({ account_id })
}

export async function addMember({ account_id, identity_id }, trx) {
  return pg
    .queryBuilder()
    .insert({ account_id, identity_id, role: 'member' })
    .into('memberships')
    .transacting(trx)
}

export async function removeMember({ account_id, identity_id }, trx) {
  return pg
    .queryBuilder()
    .delete()
    .from('memberships')
    .where({ account_id, identity_id })
    .transacting(trx)
}
