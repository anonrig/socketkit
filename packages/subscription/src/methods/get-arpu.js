import pg from '../pg.js'

export default async function getARPU(
  { account_id, application_id },
  { filter },
) {
  const { total, clients } = await pg
    .sum('base_developer_proceeds AS total')
    .countDistinct('client_id AS clients')
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

  return {
    total,
    clients,
    arpu: (parseFloat(total) / parseInt(clients)).toFixed(2),
  }
}
