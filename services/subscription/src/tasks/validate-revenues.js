import pg from '../pg/index.js'
import Logger from '../logger.js'
import { findOneToValidate, validate } from '../pg/revenues-maintain.js'

const logger = Logger.create().withScope('validate-revenues')

export default async function validateRevenues() {
  return pg.transaction(async (trx) => {
    const row = await findOneToValidate(trx)

    if (!row) {
      return false
    }

    logger.debug(
      `Processing (${row.account_id}, ${row.for_date}, ${row.application_id}, ${row.country_id})`,
    )

    await validate(trx, row)

    return true
  })
}
