import pg from '../pg.js'

export default async function getRevenue(
  { account_id, application_id },
  { filter },
) {
  const { sum } = await pg
    .queryBuilder()
    .sum('base_developer_proceeds')
    .from('client_transactions')
    .where(function () {
      this.where({ account_id })

      if (application_id) {
        this.andWhere({ application_id })
      }

      if (filter?.from && filter?.to) {
        this.andWhereBetween('event_date', [filter.from, filter.to])
      }
    })
    .first()

  return parseFloat(parseFloat(sum ?? '0.00').toFixed(2))
}
