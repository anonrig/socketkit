import pg from './index.js'

export async function findOrCreate({ identity_id }, trx) {
  const integration = await pg
    .queryBuilder()
    .transacting(trx)
    .select('account_id')
    .from('integrations')
    .forUpdate()
    .where({ identity_id })
    .first()

  if (integration) {
    return integration
  }

  const [new_integration] = await pg
    .queryBuilder()
    .transacting(trx)
    .insert({ identity_id })
    .into('integrations')
    .returning('account_id')

  return new_integration
}
