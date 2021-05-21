import dayjs from 'dayjs'
import pg from '../pg.js'
import Logger from '../logger.js'
import config from '../config.js'
import { integrations } from '../grpc-client.js'
import { updateUsage } from '../models/subscriptions.js'

const logger = Logger.create().withScope('fetch-revenues')
const environment = config.stripe.key.includes('test')
  ? 'staging'
  : 'production'

export default async function fetchRevenues() {
  return pg.transaction(async (trx) => {
    const row = await pg
      .queryBuilder()
      .select(['account_id', 'stripe_id', 'updated_stripe_at'])
      .from('integrations')
      .where({ environment, state: 'active' })
      .whereNotNull('stripe_id')
      .whereNotNull('subscription_id')
      .andWhere(function () {
        this.where(
          'updated_stripe_at',
          '<',
          dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
        )
      })
      .orderBy('updated_stripe_at', 'desc')
      .limit(1)
      .forUpdate()
      .skipLocked()
      .first()
      .transacting(trx)

    if (!row) {
      return false
    }

    const next_day = dayjs(row.updated_stripe_at)
      .add(1, 'day')
      .format('YYYY-MM-DD')

    logger.info(`Processing revenue of ${row.account_id} for ${next_day}`)

    const { total: usage } = await integrations.getTotalRevenue({
      account_id: row.account_id,
      for_date: next_day,
    })

    logger.info(`Setting usage of ${row.account_id} to ${usage}`)

    await updateUsage({
      stripe_id: row.stripe_id,
      usage,
      for_date: next_day,
    })

    await pg
      .queryBuilder()
      .update({
        updated_stripe_at: next_day,
      })
      .from('integrations')
      .where({ account_id: row.account_id })
      .transacting(trx)

    return true
  })
}
