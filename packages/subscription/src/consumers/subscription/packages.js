import pg from '../../pg.js'

export function groupByApplication({ account_id }) {
  return pg
    .select({
      application_id: 'application_id',
      subscription_package_count: pg.raw('count(*)'),
    })
    .from('subscription_packages')
    .where({ account_id })
    .groupBy('application_id')
}

export async function findAll({ account_id, application_id }, { limit = 10 }) {
  const rows = await pg
    .queryBuilder()
    .select({
      subscription_name: 'subscription_packages.name',
      subscription_duration: 'subscription_packages.subscription_duration',
      subscription_package_id: 'subscription_packages.subscription_package_id',
      subscription_group_id: 'subscription_packages.subscription_group_id',
    })
    .from('subscription_packages')
    .where({ account_id })
    .where(function () {
      if (application_id?.length) {
        this.andWhere('subscription_packages.application_id', application_id)
      }
    })
    .orderByRaw('subscription_packages.name desc')
    .limit(limit)

  return rows.map((row) => ({
    ...row,
    subscription_duration: row.subscription_duration.toPostgres(),
  }))
}
