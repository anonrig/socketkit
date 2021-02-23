import pg from '../pg.js'

export async function findOne({ provider_id }) {
  return pg
    .queryBuilder()
    .select('*')
    .from('providers')
    .where({ provider_id })
    .first()
}
