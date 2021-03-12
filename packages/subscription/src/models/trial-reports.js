import pg from '../pg.js'
import dayjs from 'dayjs'

function getWhereCondition(fields, data) {
  return fields
    .filter((f) => data[f])
    .map((f) => ({ query: `t.${f} = ?`, field: f, value: data[f] }))
}

export async function getFreeTrials({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
  transaction_type,
  application_id,
  client_currency_id,
}) {
  const available_filters = [
    'transaction_type',
    'application_id',
    'client_currency_id',
  ]
  const whereCondition = getWhereCondition(available_filters, {
    transaction_type,
    application_id,
    client_currency_id,
  })
  const fields = whereCondition.map(({ query }) => query).join(' AND ')
  const rows = await pg
    .queryBuilder()
    .select({
      primary: pg.raw(`(date_trunc(?, g)::date)::text`, [
        interval.split(' ')[1],
      ]),
      secondary: pg.raw(`l.client_count::int`),
      previous_client_count: pg.raw(
        `COALESCE(lag(l.client_count) OVER (ORDER BY g), 0)::int`,
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
          SELECT count(DISTINCT client_id) AS client_count
          FROM client_transactions AS t
          WHERE t.account_id = ?
            AND t.transaction_type = ?
            AND t.event_date >= g AND t.event_date < g + ?::interval
            ${fields.length ? ['AND'].concat(fields).join(' ') : ''}
        ) AS l
      `,
      [
        account_id,
        'trial',
        interval,
        ...whereCondition.map(({ value }) => value),
      ],
    )

  return {
    rows,
    available_filters,
    secondary_field: 'secondary',
    fields: ['secondary', 'previous_client_count'],
  }
}

export async function averageDuration({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
  subscription_package_id,
  subscription_group_id,
}) {
  const available_filters = ['subscription_package_id', 'subscription_group_id']
  const whereCondition = getWhereCondition(available_filters, {
    subscription_group_id,
    subscription_package_id,
  })
  const fields = whereCondition.map(({ query }) => query).join(' AND ')
  const rows = await pg
    .queryBuilder()
    .select({
      primary: pg.raw(`(date_trunc(?, g)::date)::text`, [
        interval.split(' ')[1],
      ]),
      average_trial_duration: pg.raw(
        `COALESCE(EXTRACT(epoch FROM l.average_trial_duration) / 86400, 0)`,
      ),
      average_subscription_duration: pg.raw(
        `COALESCE(EXTRACT(epoch FROM l.average_subscription_duration) / 86400, 0)`,
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
          FROM client_subscriptions AS s
          WHERE s.account_id = ?
            AND s.free_trial_duration != '00:00:00'
            AND LOWER(s.active_period) >= g AND LOWER(s.active_period) < g + ?::interval
            ${fields.length ? ['AND'].concat(fields).join(' ') : ''}
        ) AS l
      `,
      [account_id, interval, ...whereCondition.map(({ value }) => value)],
    )

  return {
    rows,
    available_filters,
    secondary_field: 'average_trial_duration',
    fields: ['average_trial_duration', 'average_subscription_duration'],
  }
}
