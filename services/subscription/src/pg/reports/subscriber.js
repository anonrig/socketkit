import pg from '../index.js'

export async function get({
  account_id,
  start_date,
  end_date,
  interval,
  application_id,
}) {
  const lateral_join = pg
    .queryBuilder()
    .count('*', { as: 'count' })
    .from('subscribers AS c')
    .where('c.account_id', account_id)
    .andWhere(function () {
      if (application_id) {
        this.where('c.application_id', application_id)
      }

      this.whereExists(function () {
        this.select(pg.raw('1'))
          .from('subscriptions AS s')
          .whereRaw(
            [
              's.account_id = c.account_id',
              's.subscriber_id = c.subscriber_id',
              's.active_period && daterange(g::date, (g + ?::interval)::date)',
              's.paid_period && daterange(g::date, (g + ?::interval)::date)',
            ].join(' AND '),
            [interval, interval],
          )
      })
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw('g::date'),
      y0: 'l.count',
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

export async function getCustomerLifetimeValue({
  account_id,
  start_date,
  end_date,
  interval,
  application_id,
}) {
  const join_lateral = pg
    .queryBuilder()
    .avg('total_base_developer_proceeds AS avg_total_base_developer_proceeds')
    .from('subscribers AS c')
    .where('c.account_id', account_id)
    .andWhere(function () {
      this.whereExists(function () {
        this.select(pg.raw('1'))
          .from('subscriptions AS s')
          .whereRaw(
            [
              `s.account_id = c.account_id`,
              `s.subscriber_id = c.subscriber_id`,
              `s.active_period && daterange(g::date, (g + ?::interval)::date)`,
            ].join(' AND '),
            [interval],
          )

        if (application_id) {
          this.andWhere('s.application_id', application_id)
        }
      })

      this.whereNotExists(function () {
        this.select(pg.raw('1'))
          .from('subscriptions AS s')
          .whereRaw(
            [
              `s.account_id = c.account_id`,
              `s.subscriber_id = c.subscriber_id`,
              `s.active_period && daterange(g::date, (g + ?::interval)::date)`,
              `s.active_period @> 'today'::date`,
            ].join(' AND '),
            [interval],
          )

        if (application_id) {
          this.andWhere('s.application_id', application_id)
        }
      })
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw('g::date'),
      y0: 'l.avg_total_base_developer_proceeds',
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
