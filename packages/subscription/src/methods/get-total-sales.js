import pg from '../pg.js'
import dayjs from 'dayjs'

export default async function getTotalSales(
  { account_id, application_id },
  { filter })
{
  const { sum } = await pg
    .queryBuilder()
    .sum('base_developer_proceeds')
    .from('client_transactions')
    .where(function () {
      this.where({
        'account_id': account_id,
        'application_id': application_id,
      })

      if (filter?.from && filter?.to) {
        this.andWhereBetween('event_date', [
          dayjs(filter.from).format('YYYY-MM-DD'),
          dayjs(filter.to).format('YYYY-MM-DD'),
        ])
      }
    })
    .first()

  return parseFloat(sum).toFixed(2)
}
