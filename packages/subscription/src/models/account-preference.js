import pg from '../pg.js'

export async function findByPk({ account_id, provider_id }) {
  return pg
    .select('*')
    .from('account_provider_preferences')
    .where({ account_id, provider_id })
    .first()
}

export async function create({
  account_id,
  provider_id,
  vendor_id,
  available_vendor_ids,
}) {
  return pg
    .insert({
      account_id,
      provider_id,
      vendor_id,
      available_vendor_ids,
    })
    .into('account_provider_preferences')
    .onConflict(['account_id', 'provider_id'])
    .ignore()
    .returning('*')
}
