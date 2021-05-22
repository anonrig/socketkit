import dayjs from 'dayjs'
import pg from '../pg/index.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('delete-integrations')

export default function deleteIntegrations() {
  return pg.transaction(async (trx) => {
    const integration = await pg
      .select(['account_id', 'last_fetch'])
      .from('integrations')
      .where('state', 'to_be_deleted')
      .orWhere(function () {
        this.where('state', '>=', 'error')
        this.andWhere('last_fetch', '<', dayjs().subtract(9, 'month'))
      })
      .orderBy('last_fetch')
      .limit(1)
      .forUpdate()
      .skipLocked()
      .first()
      .transacting(trx)

    if (!integration) {
      return false
    }

    const { account_id, last_fetch } = integration

    logger.info(`Deleting ${account_id} with last fetch date ${last_fetch}`)

    await pg
      .from('transactions')
      .where({ account_id })
      .delete()
      .transacting(trx)

    await pg
      .from('subscriptions')
      .where({ account_id })
      .delete()
      .transacting(trx)

    await pg.from('subscribers').where({ account_id }).delete().transacting(trx)

    await pg
      .from('subscription_packages')
      .where({ account_id })
      .delete()
      .transacting(trx)

    await pg
      .from('integrations')
      .where({ account_id })
      .delete()
      .transacting(trx)

    return true
  })
}
