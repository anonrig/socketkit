import dayjs from 'dayjs'
import pg from '../pg.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('delete-integrations')

export default function deleteIntegrations() {
  return pg.transaction(async (trx) => {
    const integration = await pg
      .select('account_id')
      .from('integrations')
      .where('state', 'to_be_deleted')
      .orWhere(function() {
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

    logger.info(
      `Deleting ${integration.account_id} with last fetch date ${integration.last_fetch}`,
    )

    // TODO: Delete stuff

    await pg
      .from('integrations')
      .where('account_id', integration.account_id)
      .delete()
      .transacting(trx)

    return true
  })
}
