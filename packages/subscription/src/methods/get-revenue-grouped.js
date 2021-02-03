import pg from '../pg.js'

export default async function getRevenue(
  { account_id, application_id, transaction_type },
  { filter },
) {
  const [total, ...data] = await pg
    .queryBuilder()
    .select(
      pg.raw(`to_char(event_date, 'YYYY-MM-DD') as event_date`),
      pg.raw('cast(sum(base_developer_proceeds) as numeric(10, 2)) as value'),
    )
    .from('client_transactions')
    .where(function () {
      this.where({ account_id })

      if (transaction_type) {
        this.andWhere({ transaction_type })
      }

      if (application_id) {
        this.andWhere({ application_id })
      }

      if (filter?.from && filter?.to) {
        this.andWhereBetween('event_date', [filter.from, filter.to])
      }
    })
    .groupByRaw(`ROLLUP (event_date)`)

  return {
    total,
    data,
  }
}
