import pg from '../index.js'

export async function get({ account_id, start_date, end_date, interval, application_id }) {
  const lateral_join = pg
    .queryBuilder()
    .sum('r.total_revenue', { as: 'total' })
    .from('revenues AS r')
    .where('r.account_id', account_id)
    .andWhere(function () {
      if (application_id) {
        this.where('r.application_id', application_id)
      }

      this.whereRaw('r.for_date >= g AND r.for_date < g + ?::interval', [interval])
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw('g::date'),
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

export async function getRecurring({
  account_id,
  start_date,
  end_date,
  interval = '1 month',
  application_id,
}) {
  const lateral_join = pg
    .queryBuilder()
    .sum('r.recurring', { as: 'recurring_sum' })
    .from('revenues AS r')
    .where('r.account_id', account_id)
    .andWhere(function () {
      if (application_id) {
        this.where('r.application_id', application_id)
      }

      this.whereRaw('r.for_date >= g AND r.for_date < g + ?::interval', [interval])
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw('g::date'),
      y0: 'l.recurring_sum',
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
  start_date,
  end_date,
  interval,
  application_id,
}) {
  const join_lateral = pg
    .queryBuilder()
    .select({
      refund_sum: pg.raw(`sum(base_developer_proceeds) FILTER (WHERE transaction_type = 'refund')`),
      sale_sum: pg.raw(
        `sum(base_developer_proceeds) FILTER (WHERE transaction_type IN ('conversion', 'renewal'))`,
      ),
    })
    .from('transactions AS t')
    .where({ 't.account_id': account_id })
    .andWhere(function () {
      if (application_id) {
        this.where('t.application_id', application_id)
      }

      this.whereRaw(`t.event_date >= g AND t.event_date < g + ?::interval`, [interval])
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw('g::date'),
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
  start_date,
  end_date,
  interval,
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
    .joinRaw(`JOIN subscription_packages p USING (account_id, subscription_package_id)`)
    .where({
      't.account_id': account_id,
      't.transaction_type': 'conversion',
    })
    .andWhere(function () {
      if (application_id) {
        this.where('t.application_id', application_id)
      }

      this.whereRaw(`t.event_date >= g AND t.event_date < g + ?::interval`, [interval])
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw('g::date'),
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
    rows,
  }
}
