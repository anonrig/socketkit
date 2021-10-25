import pg from '../pg.js'

export async function findAll({ account_id, provider_id }) {
  return pg
    .queryBuilder()
    .select('*')
    .from('integrations')
    .where(function () {
      this.where({ account_id })

      if (provider_id) {
        this.andWhere({ provider_id })
      }
    })
}

export async function upsert({ account_id, provider_id, requirement }, trx) {
  return pg
    .queryBuilder()
    .insert({ account_id, provider_id, requirement })
    .into('integrations')
    .onConflict(['account_id', 'provider_id'])
    .merge()
    .transacting(trx)
}

export async function destroy({ account_id, provider_id }, trx) {
  return pg
    .queryBuilder()
    .delete()
    .from('integrations')
    .where({ account_id, provider_id })
    .transacting(trx)
}
