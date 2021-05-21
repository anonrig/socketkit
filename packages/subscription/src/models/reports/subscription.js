import pg from '../../pg.js'
import dayjs from 'dayjs'

export async function get({
  report_id,
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
  application_id,
}) {
  const join_lateral = pg
    .queryBuilder()
    .count('*', 'count')
    .avg('total_base_developer_proceeds AS avg_total_base_developer_proceeds')
    .from('subscriptions AS s')
    .where('s.account_id', account_id)
    .andWhere(function () {
      if (application_id) {
        this.where('s.application_id', application_id)
      }

      this.whereRaw(
        [
          `s.active_period && daterange(g::date, (g + ?::interval)::date)`,
          `s.paid_period && daterange(g::date, (g + ?::interval)::date)`,
        ].join(' AND '),
        [interval, interval],
      )
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0:
        report_id === 'subscriptions'
          ? 'l.count'
          : 'l.avg_total_base_developer_proceeds',
    })
    .from(
      pg.raw(`generate_series(?::date, ?::date, ?::interval) AS g`, [
        start_date,
        end_date,
        interval,
      ]),
    )
    .joinRaw(`CROSS JOIN LATERAL (${join_lateral}) l`)

  return {
    rows,
  }
}
