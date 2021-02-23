import dayjs from 'dayjs'
import pg from '../pg.js'
import Logger from '../logger.js'
import AppStoreReporter from 'appstore-reporter'
import { parseTransaction } from '../consumers/integration/parse-transaction.js'

const logger = Logger.create().withScope('app-store-connect-fetcher')

export default function fetchIntegrations() {
  return pg.transaction(async (trx) => {
    const integration = await pg
      .select(['account_id', 'last_fetch', 'vendor_ids', 'access_token'])
      .from('integrations')
      .where('provider_id', 'apple')
      .andWhere('last_fetch', '<', dayjs().subtract(5, 'minutes'))
      .orderByRaw(['last_error_message IS NULL', 'last_fetch'])
      .limit(1)
      .forUpdate()
      .skipLocked()
      .first()
      .transacting(trx)

    if (!integration) return false

    const vendor_id = integration.vendor_ids[0]
    const next_day = dayjs(integration.last_fetch).add(1, 'day')
    var transactions

    try {
      const reporter = new AppStoreReporter.default({
        accessToken: integration.access_token,
      })
      transactions = await reporter.sales.getReport({
        vendorNumber: vendor_id,
        reportType: 'Subscriber',
        reportSubType: 'Detailed',
        dateType: 'Daily',
        date: next_day,
        reportVersion: '1_2',
      })
    } catch (error) {
      await pg
        .into('integrations')
        .where('provider_id', 'apple')
        .andWhere('account_id', integration.account_id)
        .update('last_error_message', error.message)
        .transacting(trx)

      logger.error(error)
    }

    if (!transactions) return false

    for (const transaction of transactions) {
      await parseTransaction(transaction, { account_id }, trx)
    }

    const application_ids = [
      ...new Set(transactions.map(({ application_id }) => application_id)),
    ]

    for (const application_id of application_ids) {
      try {
        // inform microservice to fetch application from store
        await client.store.create({
          application_id,
          country_id: 'us',
        })
      } catch (error) {
        // don't block the transaction, since this is an external dependency.
        logger.error(error)
      }
    }

    await pg
      .into('integrations')
      .where({
        provider_id: 'apple',
        account_id: integration.account_id,
      })
      .update({
        last_fetch: next_day,
        last_error_message: null,
      })
      .transacting(trx)

    return true
  })
}
