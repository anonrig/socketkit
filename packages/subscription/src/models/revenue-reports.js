import dayjs from 'dayjs'
import pg from '../pg.js'

export async function getMRR({
  account_id,
  range = '1 month',
  start_date,
  end_date,
  application_id,
}) {
  const available_filters = ['application_id']
  const v_charges = pg
    .queryBuilder()
    .select({
      client_id: 'client_id',
      month: pg.raw(`date_trunc(?, event_date)::date`, [range.split(' ')[1]]),
      total: 'base_developer_proceeds',
    })
    .from('client_transactions')
    .where({ account_id })
    .andWhere(function () {
      if (application_id) {
        this.andWhere({ application_id })
      }

      if (start_date && end_date) {
        this.andWhereBetween('event_date', [start_date, end_date])
      }
    })

  const v_mrr = pg
    .queryBuilder()
    .select({
      month: pg.raw(`date_trunc(?, event_date)::date`, [range.split(' ')[1]]),
      mrr: pg.sum('base_developer_proceeds'),
      clients: pg.countDistinct('client_id'),
      arpu: pg.raw(`sum(base_developer_proceeds) / count(DISTINCT client_id)`),
    })
    .from('client_transactions')
    .where({ account_id })
    .andWhere(function () {
      if (application_id) {
        this.andWhere({ application_id })
      }

      if (start_date && end_date) {
        this.andWhereBetween('event_date', [start_date, end_date])
      }
    })
    .groupByRaw('month')

  const v_mrr_changes = pg
    .queryBuilder()
    .select({
      client_id: 'this_month.client_id',
      month: 'this_month.month',
      new_mrr: pg.raw(`
        case
          when previous_month.month is null then this_month.total
          else 0
        end
      `),
      contraction_mrr: pg.raw(`
        case
          when previous_month.total is null then 0
          when previous_month.total > this_month.total then previous_month.total - this_month.total
        end
      `),
      expansion_mrr: pg.raw(`
        case
          when previous_month.total is null then 0
          when previous_month.total < this_month.total then this_month.total  - previous_month.total
        end
      `),
    })
    .from('v_charges AS this_month')
    .leftJoin('v_charges AS previous_month', function () {
      this.on('this_month.client_id', 'previous_month.client_id').andOn(
        'this_month.month',
        pg.raw(`previous_month.month + interval '1 month'`),
      )
    })

  const v_mrr_churn = pg
    .queryBuilder()
    .select({
      month: pg.raw(`this_month.month + interval '1 month'`),
      churned_mrr: pg.sum('this_month.total'),
      mrr_churn: pg.raw(`
        100 * sum(this_month.total) / v_mrr.mrr
      `),
      clients_churn: pg.raw(`
        100 * count(*) / v_mrr.clients
      `),
    })
    .from('v_charges AS this_month')
    .join('v_mrr', function () {
      this.on('v_mrr.month', 'this_month.month')
    })
    .leftJoin('v_charges AS next_month', function () {
      this.on('this_month.client_id', 'next_month.client_id').andOn(
        'this_month.month',
        pg.raw(`next_month.month - interval '1 month'`),
      )
    })
    .where(function () {
      this.whereRaw('next_month.month is null')
    })
    .groupByRaw(`1, v_mrr.mrr, v_mrr.clients`)

  const v_totals = pg
    .queryBuilder()
    .select({
      month: 'month',
      new_mrr: pg.sum('new_mrr'),
      contraction_mrr: pg.sum('contraction_mrr'),
      expansion_mrr: pg.sum('expansion_mrr'),
    })
    .from('v_mrr_changes')
    .groupByRaw('1')

  const rows = await pg
    .queryBuilder()
    .with('v_charges', v_charges)
    .with('v_mrr', v_mrr)
    .with('v_mrr_changes', v_mrr_changes)
    .with('v_mrr_churn', v_mrr_churn)
    .with('v_totals', v_totals)
    .select({
      x: pg.raw(`v_totals.month`),
      y0: pg.raw(`ROUND(COALESCE(v_mrr.mrr, 0), 2)`),
      y1: pg.raw(`v_mrr.clients`),
      y2: pg.raw('ROUND(COALESCE(v_totals.new_mrr, 0), 2)'),
      y3: pg.raw('ROUND(COALESCE(v_totals.expansion_mrr, 0), 2)'),
      y4: pg.raw(`ROUND(COALESCE(v_mrr_churn.churned_mrr*-1, 0), 2)`),
      y5: pg.raw(`ROUND(COALESCE(v_totals.contraction_mrr*-1, 0), 2)`),
      y6: pg.raw(
        `ROUND(COALESCE(new_mrr + expansion_mrr - churned_mrr - contraction_mrr, 0), 2)`,
      ),
      y7: pg.raw(`ROUND(COALESCE(v_mrr_churn.mrr_churn, 0), 2)`),
      y8: pg.raw(`COALESCE(v_mrr_churn.clients_churn, 0)`),
      y9: pg.raw(`ROUND(COALESCE(v_mrr.arpu, 0), 2)`),
    })
    .from('v_totals')
    .leftJoin('v_mrr_churn', function () {
      this.on('v_totals.month', 'v_mrr_churn.month')
    })
    .join('v_mrr', function () {
      this.on('v_mrr.month', 'v_totals.month')
    })
    .whereRaw(`v_totals.month < date_trunc(?, now())`, [range.split(' ')[1]])
    .orderBy('v_totals.month', 'desc')

  return {
    ny: 10,
    rows,
  }
}

function getWhereCondition(fields, data) {
  return fields
    .filter((f) => data[f])
    .map((f) => ({ query: `s.${f} = ?`, field: f, value: data[f] }))
}

export async function getSalesRefunds({
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
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0: 'l.renewal_sum',
      y0: 'l.refund_sum',
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
              FILTER (WHERE transaction_type = 'refund')
              AS refund_sum
          FROM client_transactions t
          WHERE t.account_id = ? AND
            t.event_date >= g AND
            t.event_date < g + ?::interval
            ${fields.length ? ['AND'].concat(fields).join(' ') : ''}
        ) l
      `,
      [account_id, interval, ...whereCondition.map(({ value }) => value)],
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
      x: pg.raw(`(date_trunc(?, g)::date)::text`, [interval.split(' ')[1]]),
      y0: 'l.mrr'
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
          SELECT t.base_developer_proceeds *
            (30 * 24 * 60 * 60 / date_part('epoch', s.subscription_duration))
            AS mrr
          FROM client_transactions t
            JOIN subscription_packages s USING (account_id, subscription_package_id)
          WHERE t.account_id = ? AND
            t.transaction_type = 'renewal' AND
            t.event_date >= g AND
            t.event_date < g + ?::interval AND
            NOT EXISTS (
              SELECT 1
              FROM client_transactions t1
              WHERE
                t1.account_id = t.account_id AND
                t1.client_id = t.client_id AND
                t1.transaction_type = 'renewal' AND
                t1.event_date < t.event_date
            )
            ${fields.length ? ['AND'].concat(fields).join(' ') : ''}
        ) l
      `,
      [account_id, interval, ...whereCondition.map(({ value }) => value)],
    )

  return {
    ny: 2,
    rows,
  }
}
