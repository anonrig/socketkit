import pg from '../src/pg.js'
import * as Integrations from '../src/pg/integrations.js'

export function removeIntegration({ account_id, provider_id }) {
  return pg.transaction(async (trx) => Integrations.destroy({ account_id, provider_id }, trx))
}
