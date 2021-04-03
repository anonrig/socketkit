import pg from '../pg.js'
import dayjs from 'dayjs'

export async function getFreeTrials({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
}) {
  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0: 'l.client_count',
    })
    .from(
      pg.raw(`generate_series(?::date, ?::date, ?::interval) AS g`, [
        start_date,
        end_date,
        interval,
      ]),
    )
    .joinRaw(
      `
        CROSS JOIN LATERAL (
          SELECT count(DISTINCT client_id) AS client_count
          FROM transactions AS t
          WHERE t.account_id = ?
            AND t.transaction_type = ?
            AND t.event_date >= g AND t.event_date < g + ?::interval
        ) AS l
      `,
      [account_id, 'trial', interval],
    )

  return {
    ny: 1,
    rows,
  }
}

export async function averageDuration({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
}) {
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
    .joinRaw(
      `
        CROSS JOIN LATERAL (
          SELECT
            AVG(s.free_trial_duration) AS average_trial_duration,
            AVG(s.subscription_duration) AS average_subscription_duration
          FROM subscriptions AS s
          WHERE s.account_id = ?
            AND s.free_trial_duration != '00:00:00'
            AND LOWER(s.active_period) >= g AND LOWER(s.active_period) < g + ?::interval
        ) AS l
      `,
      [account_id, interval],
    )

  return {
    ny: 1,
    rows,
  }
}

export async function getTrialToPaid({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
}) {
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
    .joinRaw(
      `
        CROSS JOIN LATERAL (
          SELECT
            count(*) AS total,
            count(*) FILTER (
              WHERE (lower(s.active_period) + s.free_trial_duration)::date <
                upper(s.active_period)) AS converted
          FROM subscriptions s
          WHERE
            s.account_id = ? AND
            s.active_period && daterange(g::date, (g + ?::interval)::date) AND
            s.free_trial_duration > '00:00'::interval AND
            (lower(s.active_period) + s.free_trial_duration)::date <@
              daterange(g.date,  (g.date + ?::interval)::date)
        ) l
      `,
      [account_id, interval, interval],
    )

  return {
    ny: 1,
    rows,
  }
}
