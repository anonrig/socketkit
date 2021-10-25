import pg from './index.js'

export function invalidate(trx, account_id, revenue_list) {
  return pg
    .queryBuilder()
    .transacting(trx)
    .from('revenues')
    .update('is_valid', false)
    .where('account_id', account_id)
    .andWhere(function () {
      for (const { first_day, ...rest } of revenue_list) {
        this.orWhere(function () {
          this.where(rest)
          this.andWhere('for_date', '>=', first_day)
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
      Array.from(revenue_list, ({ first_day, ...rest }) => ({
        account_id,
        for_date: revenue_list.current_day,
        ...rest,
      })),
    )

  // Some days there may not be any transactions for s given application
  // and country.  We don't want to have gaps in the statistics.  It's
  // better to fill those with 0s.  Also, sometimes we receive transactions
  // on a later day, and invalidate the stats for previous days.  If we
  // hadn't been filling the gaps in here, some values would go missing.
  await pg
    .queryBuilder()
    .transacting(trx)
    .from(pg.raw('revenues (account_id, for_date, application_id, country_id)'))
    .insert(function () {
      this.from('revenues AS a')
        .where('account_id', account_id)
        .andWhere('for_date', revenue_list.previous_day)
        .andWhere(
          pg.raw(
            'NOT EXISTS (' +
              'SELECT 1 ' +
              'FROM revenues b ' +
              'WHERE a.account_id = b.account_id AND ' +
              'a.application_id = b.application_id AND ' +
              'a.country_id = b.country_id AND ' +
              'b.for_date = ?' +
              ')',
            [revenue_list.current_day],
          ),
        )
        .select([
          pg.raw('account_id'),
          pg.raw('?', revenue_list.current_day),
          pg.raw('application_id'),
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
    .select(['account_id', 'for_date', 'application_id', 'country_id'])
    .first()
}

export function validate(
  trx,
  { account_id, for_date, application_id, country_id },
) {
  return pg
    .queryBuilder()
    .transacting(trx)
    .select(
      pg.raw('validate_revenues(?, ?, ?, ?)', [
        account_id,
        for_date,
        application_id,
        country_id,
      ]),
    )
}
