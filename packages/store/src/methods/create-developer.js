import pg from '../pg.js'

export async function createDeveloper({
  developer_id,
  name,
  store_url,
  website,
}) {
  const existing = await pg
    .queryBuilder()
    .select('*')
    .from('developers')
    .where({ developer_id })
    .first()

  if (existing) {
    return existing
  }

  return pg
    .queryBuilder()
    .insert({ developer_id, name, store_url, website }, '*')
    .into('developers')
    .onConflict(['developer_id'])
    .ignore()
    .returning('*')
}
