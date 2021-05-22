import pg from '../pg/index.js'
import Logger from '../logger.js'
import { findOneToValidate, validate } from '../pg/revenues-manipulate.js'

const logger = Logger.create().withScope('app-store-connect-fetcher')

export default async function recalculateRevenues() {
  return pg.transaction(async (trx) => {
    const row = await findOneToValidate(trx)

    if (!row) {
      return false
    }

    logger.info(
      `Processing (${row.account_id}, ${row.for_date}, ${row.application_id}, ${row.country_id})`,
    )

    await validate(trx, row)

    return true
  })
}
