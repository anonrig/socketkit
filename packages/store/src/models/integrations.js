import pg from '../pg.js'

export async function findAll({ account_id }) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'i.account_id',
      application_id: 'i.application_id',
      country_id: 'i.country_id',
      created_at: 'i.created_at',
    })
    .from('integrations AS i')
    .where({
      'i.account_id': account_id,
    })
    .join('applications AS a', 'a.application_id', 'i.application_id')
    .orderBy('created_at', 'desc')
}

export async function findOne({ account_id, application_id, country_id }, trx) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'i.account_id',
      application_id: 'i.application_id',
      country_id: 'i.country_id',
      created_at: 'i.created_at',
    })
    .from('integrations AS i')
    .where({
      'i.account_id': account_id,
      'i.application_id': application_id,
      'i.country_id': country_id.toLowerCase(),
    })
    .join('applications AS a', 'a.application_id', 'i.application_id')
    .transacting(trx)
    .first()
}

export async function create({ account_id, application_id, country_id }, trx) {
  await pg
    .queryBuilder()
    .insert({
      application_id,
      country_id,
    })
    .into('reviews_watchlist')
    .onConflict(['application_id', 'country_id'])
    .ignore()
    .transacting(trx)

  await pg
    .queryBuilder()
    .insert({
      account_id,
      application_id,
      country_id: country_id.toLowerCase(),
    })
    .into('integrations')
    .onConflict(['account_id', 'application_id', 'country_id'])
    .ignore()
    .transacting(trx)

  return {}
}

export async function destroy({ account_id, application_id, country_id }, trx) {
  await pg
    .queryBuilder()
    .delete('*')
    .from('integrations')
    .where({ account_id, application_id, country_id })
    .transacting(trx)

  // @TODO: Clean reviews_watchlist if no integrations exist.
}
