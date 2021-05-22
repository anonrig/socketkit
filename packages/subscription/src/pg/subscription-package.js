import pg from './index.js'

export async function findAll(
  { account_id, application_id },
  { limit = 10 } = {},
) {
  const rows = await pg
    .queryBuilder()
    .select({
      subscription_name: 'name',
      subscription_duration: 'subscription_duration',
      subscription_package_id: 'subscription_package_id',
      subscription_group_id: 'subscription_group_id',
    })
    .from('subscription_packages')
    .where({ account_id })
    .andWhere(function () {
      if (application_id) {
        this.andWhere('application_id', application_id)
      }
    })
    .orderByRaw('name desc')
    .limit(limit)

  return rows.map((row) => ({
    ...row,
    subscription_duration: row.subscription_duration.toPostgres(),
  }))
}

export function groupByApplication({ account_id }) {
  return pg
    .count('*', 'subscription_packge_count')
    .select(['application_id'])
    .from('subscription_packages')
    .where({ account_id })
    .groupBy('application_id')
}
