import dayjs from 'dayjs'
import pg from '../../pg.js'

export async function getMRR({
  account_id,
  start_date,
  end_date,
  interval = '1 month',
  application_id,
}) {
  const lateral_join = pg
    .queryBuilder()
    .sum('t.base_developer_proceeds', { as: 'total' })
    .from('transactions AS t')
    .where('t.account_id', account_id)
    .andWhere(function () {
      if (application_id) {
        this.andWhere('t.application_id', application_id)
      }

      this.whereRaw('t.event_date >= g AND t.event_date < g + ?::interval', [
        interval,
      ])
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0: 'l.total',
    })
    .from(
      pg.raw(`generate_series(?::date, ?::date, ?::interval) AS g`, [
        start_date,
        end_date,
        interval,
      ]),
    )
    .joinRaw(`CROSS JOIN LATERAL (${lateral_join}) l`)

  return {
    rows,
  }
}

export async function getSalesRefunds({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
  application_id,
}) {
  const join_lateral = pg
    .queryBuilder()
    .select({
      sale_sum: pg.raw(
        `sum(base_developer_proceeds) FILTER (WHERE transaction_type IN ('conversion', 'renewal'))`,
      ),
      refund_sum: pg.raw(
        `sum(base_developer_proceeds) FILTER (WHERE transaction_type = 'refund')`,
      ),
    })
    .from('transactions AS t')
    .where({ 't.account_id': account_id })
    .andWhere(function () {
      if (application_id) {
        this.where('t.application_id', application_id)
      }

      this.whereRaw(`t.event_date >= g AND t.event_date < g + ?::interval`, [
        interval,
      ])
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw('(date_trunc(?, g)::date)::text', [interval.split(' ')[1]]),
      y0: pg.raw('COALESCE(l.sale_sum, 0)'),
      y1: pg.raw('COALESCE(l.refund_sum * -1, 0)'),
    })
    .from(
      pg.raw('generate_series(?::date, ?::date, ?::interval) AS g', [
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

export async function getAverageSale({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
  application_id,
}) {
  const join_lateral = pg
    .queryBuilder()
    .select({
      mrr: pg.raw(
        `avg(t.base_developer_proceeds * (30 * 24 * 3600 / date_part('epoch', p.subscription_duration)))`,
      ),
    })
    .from('transactions AS t')
    .joinRaw(
      `JOIN subscription_packages p USING (account_id, subscription_package_id)`,
    )
    .where({
      't.account_id': account_id,
      't.transaction_type': 'conversion',
    })
    .andWhere(function () {
      if (application_id) {
        this.where('t.application_id', application_id)
      }

      this.whereRaw(`t.event_date >= g AND t.event_date < g + ?::interval`, [
        interval,
      ])
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0: 'l.mrr',
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
    ny: 2,
    rows,
  }
}
