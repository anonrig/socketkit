import pg from './index.js'

export async function findOrCreate(trx, { identity_id }) {
  let integration = await pg
    .queryBuilder()
    .transacting(trx)
    .select('account_id')
    .from('integrations')
    .forUpdate()
    .where({ integration_id })
    .first()

  if (!integration) {
    [integration] = await pg
      .queryBuilder()
      .transacting(trx)
      .insert({ identity_id })
      .into('integrations')
      .returning('account_id')
  }

  return integration
}
