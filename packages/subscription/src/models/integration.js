import dayjs from 'dayjs'
import pg from '../pg.js'

export async function create({
  account_id,
  provider_id,
  access_token,
  vendor_ids,
}) {
  return pg
    .queryBuilder()
    .insert({
      last_fetch: dayjs().subtract(9, 'month'),
      account_id,
      provider_id,
      access_token,
      vendor_ids,
      last_error_message: null,
    })
    .into('integrations')
    .onConflict(['account_id', 'provider_id'])
    .ignore()
}

export async function findOne({ account_id, provider_id }) {
  return pg
    .queryBuilder()
    .select('*')
    .from('integrations')
    .where({ account_id, provider_id })
    .first()
}
