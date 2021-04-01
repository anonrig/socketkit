import pg from '../pg.js'

export async function findAll({ account_id }) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'i.account_id',
      application_id: 'i.application_id',
      application_title: 'avc.title',
      application_icon: 'av.icon',
      country_id: 'i.country_id',
      created_at: 'i.created_at',
    })
    .from('integrations AS i')
    .where({
      'i.account_id': account_id,
    })
    .join('applications AS a', 'a.application_id', 'i.application_id')
    .join('application_releases AS ar', function () {
      this.on('a.application_id', 'ar.application_id').andOn(
        'a.default_country_id',
        'ar.country_id',
      )
    })
    .join('application_version_contents AS avc', function () {
      this.on('a.application_id', 'avc.application_id')
        .andOn('ar.latest_version_number', 'avc.version_number')
        .andOn('ar.default_language_id', 'avc.language_id')
    })
    .join('application_versions AS av', function () {
      this.on('a.application_id', 'av.application_id').andOn(
        'ar.latest_version_number',
        'av.version_number',
      )
    })
    .orderBy('created_at', 'desc')
}

export async function findOne({ account_id, application_id, country_id }, trx) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'i.account_id',
      application_id: 'i.application_id',
      application_title: 'avc.title',
      application_icon: 'av.icon',
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
    .join('application_releases AS ar', function () {
      this.on('a.application_id', 'ar.application_id').andOn(
        'a.default_country_id',
        'ar.country_id',
      )
    })
    .join('application_version_contents AS avc', function () {
      this.on('a.application_id', 'avc.application_id')
        .andOn('ar.latest_version_number', 'avc.version_number')
        .andOn('ar.default_language_id', 'avc.language_id')
    })
    .join('application_versions AS av', function () {
      this.on('a.application_id', 'av.application_id').andOn(
        'ar.latest_version_number',
        'av.version_number',
      )
    })
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
