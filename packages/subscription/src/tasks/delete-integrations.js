import dayjs from 'dayjs'
import pg from '../pg.js'
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
      logger.info('No integrations to delete')
      return false
    }

    const { account_id, last_fetch } = integration

    logger.info(`Deleting ${account_id} with last fetch date ${last_fetch}`)

    await pg
      .from('client_transactions')
      .where({ account_id })
      .delete()
      .transacting(trx)

    await pg
      .from('client_subscriptions')
      .where({ account_id })
      .delete()
      .transacting(trx)

    await pg.from('clients').where({ account_id }).delete().transacting(trx)

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
