import dayjs from 'dayjs'
import pg from '../pg.js'

export async function getMRR({
  account_id,
  start_date,
  end_date,
  interval = '1 month',
}) {
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
    .joinRaw(
      `
        CROSS JOIN LATERAL (
          SELECT
            sum(base_developer_proceeds) AS total
          FROM transactions t
          WHERE t.account_id = ? AND
            t.event_date >= g AND
            t.event_date < g + ?::interval
        ) l
      `,
      [account_id, interval],
    )

  return {
    ny: 1,
    rows,
  }
}

export async function getSalesRefunds({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
}) {
  const rows = await pg
    .queryBuilder()
    .select({
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0: 'l.renewal_sum',
      y1: 'l.refund_sum',
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
            sum(base_developer_proceeds)
              FILTER (WHERE transaction_type = 'renewal')
              AS renewal_sum,
            sum(base_developer_proceeds)
              FILTER (WHERE transaction_type = 'refund') * -1
              AS refund_sum
          FROM transactions t
          WHERE t.account_id = ? AND
            t.event_date >= g AND
            t.event_date < g + ?::interval
        ) l
      `,
      [account_id, interval],
    )

  return {
    ny: 2,
    rows,
  }
}

export async function getAverageSale({
  account_id,
  start_date = dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  end_date = dayjs().format('YYYY-MM-DD'),
  interval = '1 week',
}) {
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
    .joinRaw(
      `
        CROSS JOIN LATERAL (
          SELECT avg(t.base_developer_proceeds *
            (30 * 24 * 60 * 60 / date_part('epoch', s.subscription_duration)))
            AS mrr
          FROM transactions t
            JOIN subscription_packages s USING (account_id, subscription_package_id)
          WHERE t.account_id = ? AND
            t.transaction_type = 'renewal' AND
            t.event_date >= g AND
            t.event_date < g + ?::interval AND
            NOT EXISTS (
              SELECT 1
              FROM transactions t1
              WHERE
                t1.account_id = t.account_id AND
                t1.client_id = t.client_id AND
                t1.transaction_type = 'renewal' AND
                t1.event_date < t.event_date
            )
        ) l
      `,
      [account_id, interval],
    )

  return {
    ny: 2,
    rows,
  }
}
