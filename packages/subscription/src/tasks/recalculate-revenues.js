import pg from '../pg.js'

export default async function recalculateRevenues() {
  return pg.transaction(async (trx) => {
    const row = await pg
      .queryBuilder()
      .select(['account_id', 'for_date', 'country_id'])
      .from('revenues')
      .where({ refetch_needed: true })
      .limit(1)
      .forUpdate()
      .skipLocked()
      .first()
      .transacting(trx)

    if (!row) {
      return false
    }

    await pg
      .queryBuilder()
      .select(
        pg.raw('update_revenues(?, ?, ?)', [
          row.account_id,
          row.for_date,
          row.country_id,
        ]),
      )
      .transacting(trx)

    return true
  })
}
