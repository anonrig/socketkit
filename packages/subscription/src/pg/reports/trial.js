import pg from '../index.js'

export async function get({
  account_id,
  start_date,
  end_date,
  interval,
  application_id,
}) {
  const join_lateral = pg
    .queryBuilder()
    .select({
      subscriber_count: pg.raw('count(distinct t.subscriber_id)'),
    })
    .from('transactions AS t')
    .where({
      't.account_id': account_id,
      't.transaction_type': 'trial',
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
      y0: 'l.subscriber_count',
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

export async function getActive({
  account_id,
  start_date,
  end_date,
  interval,
  application_id,
}) {
  const join_lateral = pg
    .queryBuilder()
    .count('*', 'count')
    .from('subscriptions AS s')
    .where('s.account_id', account_id)
    .andWhere(function () {
      if (application_id) {
        this.where('s.application_id', application_id)
      }

      this.whereRaw(
        [
          `s.active_period && daterange(g::date, (g + ?::interval)::date)`,
          `NOT (s.paid_period && daterange(g::date, (g + ?::interval)::date))`,
        ].join(' AND '),
        [interval, interval],
      )
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0: 'l.count',
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

export async function getAverageDuration({
  account_id,
  start_date,
  end_date,
  interval,
  application_id,
}) {
  const join_lateral = pg
    .queryBuilder()
    .avg('s.free_trial_duration AS average_trial_duration')
    .from('subscriptions AS s')
    .where('s.account_id', account_id)
    .andWhere('s.free_trial_duration', '!=', '00:00:00')
    .andWhere(function () {
      if (application_id) {
        this.where('s.application_id', application_id)
      }

      this.whereRaw(
        `LOWER(s.active_period) >= g AND LOWER(s.active_period) < g + ?::interval`,
        [interval],
      )
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0: pg.raw(
        `COALESCE(EXTRACT(epoch FROM l.average_trial_duration) / 86400, 0)`,
      ),
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

export async function getTrialToPaid({
  account_id,
  start_date,
  end_date,
  interval,
  application_id,
}) {
  const join_lateral = pg
    .queryBuilder()
    .select({
      total: pg.raw('count(*)'),
      converted: pg.raw(
        'count(*) FILTER (WHERE (subscription_started_at + s.free_trial_duration)::date < subscription_expired_at)',
      ),
    })
    .from('subscriptions AS s')
    .where('s.account_id', account_id)
    .andWhere(function () {
      if (application_id) {
        this.where('s.application_id', application_id)
      }

      this.whereRaw(
        [
          `s.active_period && daterange(g::date, (g + ?::interval)::date)`,
          `s.free_trial_duration > '00:00'::interval`,
          `(s.subscription_started_at + s.free_trial_duration)::date <@ daterange(g.date,  (g.date + ?::interval)::date)`,
        ].join(' AND '),
        [interval, interval],
      )
    })

  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0: pg.raw(
        'CASE WHEN l.total > 0 THEN 100.0 * l.converted / l.total ELSE 0 END',
      ),
      y1: 'l.converted',
      y2: 'l.total',
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
