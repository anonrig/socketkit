import pg from '../../pg.js'

export function findGroupByApplication({ account_id }) {
  return pg
    .select({
      application_id: 'application_id',
      subscription_package_count: pg.raw('count(*)'),
    })
    .from('subscription_packages')
    .where({ account_id })
    .groupBy('application_id')
}
