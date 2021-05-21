import dayjs from 'dayjs'
import pg from '../pg.js'
import Logger from '../logger.js'
import config from '../config.js'
import { retrieve } from '../models/subscriptions.js'

const logger = Logger.create().withScope('update-stripe')
const environment = config.stripe.key.includes('test')
  ? 'staging'
  : 'production'

export default async function updateStripe() {
  return pg.transaction(async (trx) => {
    const row = await pg
      .queryBuilder()
      .select(['account_id', 'subscription_id', 'state'])
      .from('integrations')
      .where({ environment, state: 'active' })
      .whereNotNull('stripe_id')
      .whereNotNull('subscription_id')
      .andWhere('expired_at', '<', dayjs().format('YYYY-MM-DD'))
      .orderBy('expired_at', 'desc')
      .limit(1)
      .forUpdate()
      .skipLocked()
      .first()
      .transacting(trx)

    if (!row) {
      return false
    }

    logger.info(`Checking the current state of ${row.account_id}`)

    const {
      status,
      current_period_end,
      current_period_start,
      cancel_at,
    } = await retrieve({ subscription_id: row.subscription_id })

    if (status !== row.state) {
      await pg
        .queryBuilder()
        .update({
          state: striped.status,
          started_at: dayjs(current_period_start * 1000),
          expired_at: dayjs((cancel_at ?? current_period_end) * 1000),
        })
        .from('integrations')
        .where({ account_id: row.account_id })
        .transacting(trx)
    }

    return true
  })
}
