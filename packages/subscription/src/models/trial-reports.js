import pg from '../pg.js'
import dayjs from 'dayjs'

function getWhereCondition(fields, data) {
  return fields
    .filter((f) => data[f])
    .map((f) => ({ query: `t.${f} = ?`, field: f, value: data[f] }))
}

export default async function getFreeTrials({
  account_id,
  application_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
}) {
  const whereCondition = getWhereCondition(['application_id'], {
    application_id,
  })
  const fields = whereCondition.map(({ query }) => query).join(' AND ')

  const rows = await pg
    .queryBuilder()
    .select({
      key: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      value: 'l.client_count',
      previous_value: pg.raw(
        `COALESCE(lag(l.client_count) OVER (ORDER BY g), 0)`,
      ),
    })
    .from(
      pg.raw(`generate_series (?::date, ?::date, ?::interval) AS g`, [
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

  return { rows }
}
