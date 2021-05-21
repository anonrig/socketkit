import pg from '../pg.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('app-store-connect-fetcher')

export default async function recalculateRevenues() {
  return pg.transaction(async (trx) => {
    const row = await pg
      .queryBuilder()
      .select([
        'account_id',
        pg.raw('for_date::text AS for_date'),
        'country_id',
      ])
      .from('revenues')
      .where({ refetch_needed: true })
      .orderBy('for_date')
      .limit(1)
      .forUpdate()
      .skipLocked()
      .first()
      .transacting(trx)

    if (!row) {
      return false
    }

    logger.info(
      `Processing ${row.account_id} for ${row.for_date} and ${row.country_id}`,
    )

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
