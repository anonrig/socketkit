import pg from '../pg.js'

export async function count({ account_id, application_id }) {
  const { count } = await pg
    .queryBuilder()
    .count()
    .from('subscription_packages')
    .where(function () {
      this.where('account_id', account_id)

      if (application_id) {
        this.andWhere('application_id', application_id)
      }
    })
    .first()

  return count
}

export async function findAll(
  { account_id, application_id },
  { limit = 10, offset = 0 },
) {
  const rows = await pg
    .queryBuilder()
    .select({
      subscription_name: 'sp.name',
      subscription_duration: 'sp.subscription_duration',
      subscription_package_id: 'sp.subscription_package_id',
      subscription_group_id: 'sp.subscription_group_id',
    })
    .from('subscription_packages as sp')
    .where(function () {
      this.where('sp.account_id', account_id)

      if (application_id) {
        this.andWhere('sp.application_id', application_id)
      }
    })
    .orderByRaw('sp.name desc')
    .limit(limit)
    .offset(offset)

  return rows.map((row) => ({
    ...row,
    subscription_duration: row.subscription_duration.toPostgres(),
  }))
}
