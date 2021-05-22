import pg from './index.js'

export function invalidate(trx, account_id, revenue_list) {
  return pg.queryBuilder()
    .transacting(trx)
    .from('revenues')
    .update('is_valid', false)
    .where('account_id', account_id)
    .andWhere(function () {
      for (const { country_id, first_day } of revenue_list) {
        this.orWhere(function () {
          this.where('country_id', country_id)
          this.andWhere('for_date', '>=', first_day.format('YYYY-MM-DD'))
        })
      }
    })
}

export async function insertCurrentDay(trx, account_id, revenue_list) {
  await pg
    .queryBuilder()
    .transacting(trx)
    .from('revenues')
    .insert(
      Array.from(revenue_list, ({ country_id, first_day }) => ({
        account_id,
        for_date: revenue_list.current_day.format('YYYY-MM-DD'),
        country_id,
      })),
    )

  await pg
    .queryBuilder()
    .transacting(trx)
    .from(pg.raw('revenues (account_id, for_date, country_id)'))
    .insert(function () {
      this.from('revenues AS a')
        .where('account_id', account_id)
        .andWhere('for_date', revenue_list.previous_day.format('YYYY-MM-DD'))
        .andWhere(
          pg.raw(
            'NOT EXISTS (' +
              'SELECT 1 ' +
              'FROM revenues b ' +
              'WHERE a.account_id = b.account_id AND ' +
              'a.country_id = b.country_id AND ' +
              'b.for_date = ?' +
              ')',
            [revenue_list.current_day.format('YYYY-MM-DD')],
          ),
        )
        .select([
          pg.raw('account_id'),
          pg.raw('?', revenue_list.current_day.format('YYYY-MM-DD')),
          pg.raw('country_id'),
        ])
    })
}

export function findOneToValidate(trx) {
  return pg
    .queryBuilder()
    .transacting(trx)
    .from('revenues')
    .where('is_valid', false)
    .orderBy('for_date')
    .limit(1)
    .forUpdate()
    .skipLocked()
    .select(['account_id', pg.raw('for_date::text AS for_date'), 'country_id'])
    .first()
}

export function validate(trx, { account_id, for_date, country_id }) {
  return pg
    .queryBuilder()
    .transacting(trx)
    .select(
      pg.raw('validate_revenues(?, ?, ?)', [account_id, for_date, country_id]),
    )
}
