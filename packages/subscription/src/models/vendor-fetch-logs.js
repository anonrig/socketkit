import pg from '../pg.js'

export async function create({
  account_id,
  vendor_id,
  fetch_date,
  successful,
  payload,
}) {
  return pg
    .insert({
      account_id,
      vendor_id,
      fetch_date,
      successful,
      payload,
    })
    .into('vendor_fetch_logs')
    .onConflict(['account_id', 'vendor_id', 'fetch_date', 'successful'])
    .merge()
    .returning('*')
}

export async function findOne(condition) {
  return pg.select('*').from('vendor_fetch_logs').where(condition).first()
}
