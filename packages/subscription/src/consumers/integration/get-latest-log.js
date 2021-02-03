import pg from '../../pg.js'

export default async function getLatestLog({ account_id }) {
  return pg
    .queryBuilder()
    .select('*')
    .from('vendor_fetch_logs')
    .where({ account_id })
    .orderBy('fetch_date', 'desc')
    .first()
}
