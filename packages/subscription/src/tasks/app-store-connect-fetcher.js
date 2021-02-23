import dayjs from 'dayjs'
import pg from '../pg.js'
import Logger from '../logger.js'
import AppStoreReporter from 'appstore-reporter'
import { parseTransaction } from '../consumers/integration/parse-transaction.js'
import client from '../grpc-client.js'
import slug from 'slug'

const logger = Logger.create().withScope('app-store-connect-fetcher')

export default function fetchIntegrations() {
  return pg.transaction(async (trx) => {
    const integration = await pg
      .select(['account_id', 'last_fetch', 'vendor_ids', 'access_token'])
      .from('integrations')
      .where('provider_id', 'apple')
      .andWhere('last_fetch', '<', dayjs().subtract(5, 'minutes'))
      .orderByRaw('last_error_message IS NULL, last_fetch')
      .limit(1)
      .forUpdate()
      .skipLocked()
      .first()
      .transacting(trx)

    if (!integration) return false

    logger.info(
      `Processing ${integration.account_id} with last fetch date ${integration.last_fetch}`,
    )

    const vendor_id = integration.vendor_ids[0]
    const next_day = dayjs(integration.last_fetch).add(1, 'day')
    let transactions

    try {
      const reporter = new AppStoreReporter.default({
        accessToken: integration.access_token,
      })
      transactions = await reporter.sales.getReport({
        vendorNumber: vendor_id,
        reportType: 'Subscriber',
        reportSubType: 'Detailed',
        dateType: 'Daily',
        date: next_day.format('YYYYMMDD'),
        reportVersion: '1_2',
      })
    } catch (error) {
      if (error.message.includes('404')) {
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
      } else {
        await pg
          .into('integrations')
          .where('provider_id', 'apple')
          .andWhere('account_id', integration.account_id)
          .update('last_error_message', error.message)
          .transacting(trx)

        logger.error(error)
      }
    }

    if (!transactions) return false

    // somehow, some transactions doesn't have any eventDate or subscriberId.
    // eliminate those faulty transactions. TODO: investigate this.
    transactions = transactions.filter((t) => !!t.eventDate)

    // create device types
    await pg
      .insert(
        transactions.map((t) => ({
          provider_id: 'apple',
          device_type_id: slug(t.device),
          name: t.device,
        })),
      )
      .into('device_types')
      .onConflict(['provider_id', 'device_type_id'])
      .ignore()
      .transacting(trx)

    // create client
    await pg
      .insert(
        transactions.map((t) => ({
          account_id: integration.account_id,
          provider_id: 'apple',
          client_id: t.subscriberId,
          device_type_id: slug(t.device),
          country_id: t.country,
          first_interaction: dayjs(t.eventDate).format('YYYY-MM-DD'),
          total_base_client_purchase: 0,
          total_base_developer_proceeds: 0,
        })),
      )
      .into('clients')
      .onConflict(['account_id', 'client_id'])
      .ignore()
      .transacting(trx)

    // create subscription package
    await pg
      .insert(
        transactions.map((t) => ({
          account_id: integration.account_id,
          application_id: t.appAppleId,
          subscription_group_id: t.subscriptionGroupId,
          subscription_package_id: t.subscriptionAppleId,
          subscription_duration: t.standardSubscriptionDuration,
          name: t.subscriptionName,
        })),
      )
      .into('subscription_packages')
      .onConflict(['account_id', 'subscription_package_id'])
      .ignore()
      .transacting(trx)

    for (const transaction of transactions) {
      await parseTransaction(
        transaction,
        { account_id: integration.account_id },
        trx,
      )
    }

    const application_ids = [
      ...new Set(transactions.map(({ appAppleId }) => appAppleId)),
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
