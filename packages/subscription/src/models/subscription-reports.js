import pg from '../pg.js'
import dayjs from 'dayjs'

function getWhereCondition(fields, data) {
  return fields
    .filter((f) => data[f])
    .map((f) => ({ query: `s.${f} = ?`, field: f, value: data[f] }))
}

export async function get({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
  application_id,
}) {
  const available_filters = ['application_id']
  const whereCondition = getWhereCondition(available_filters, {
    application_id,
  })
  const fields = whereCondition.map(({ query }) => query).join(' AND ')
  const rows = await pg
    .queryBuilder()
    .select({
      primary: pg.raw(`(date_trunc(?, g)::date)::text`, [
        interval.split(' ')[1],
      ]),
      count: pg.raw(`l.count::int`),
      avg_total_base_developer_proceeds: 'avg_total_base_developer_proceeds',
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
          SELECT
            count(*) AS count,
            avg(total_base_developer_proceeds) AS avg_total_base_developer_proceeds
          FROM client_subscriptions s
          WHERE s.account_id = ?
            AND s.active_period && daterange(g::date, (g + ?::interval)::date)
            ${fields.length ? ['AND'].concat(fields).join(' ') : ''}
        ) l
      `,
      [account_id, interval, ...whereCondition.map(({ value }) => value)],
    )

  return {
    rows,
    available_filters,
    secondary_field: 'count',
    fields: ['count', 'avg_total_base_developer_proceeds'],
  }
}
