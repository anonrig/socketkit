import pg from '../pg.js'
import dayjs from 'dayjs'

export default async function getRefunds(
  { account_id, application_id },
  { filter, force_positiveness },
) {
  const { sum } = await pg
    .queryBuilder()
    .sum('base_developer_proceeds')
    .from('client_transactions')
    .where(function () {
      this.where({ account_id, transaction_type: 'refund' })

      if (application_id) {
        this.andWhere({ application_id })
      }

      if (filter?.from && filter?.to) {
        this.andWhereBetween('event_date', [filter.from, filter.to])
      }
    })
    .first()

  const multiplier = force_positiveness ? -1 : 1
  return parseFloat(parseFloat(sum ?? 0.0).toFixed(2)) * multiplier
}
