import _ from 'lodash'
import dayjs from 'dayjs'
import { PerformanceObserver, performance } from 'perf_hooks'
import slug from 'slug'
import AppStoreReporter from 'appstore-reporter'

import pg from '../pg.js'
import Logger from '../logger.js'
import { parseTransaction } from '../models/transaction-insert.js'
import subscriber from '../grpc-client.js'

const logger = Logger.create().withScope('app-store-connect-fetcher')
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    logger
      .withTag('performance')
      .info(`Time for ${entry.name} is ${entry.duration.toFixed(2)}`)
  })
})
performanceObserver.observe({ entryTypes: ['measure'], buffered: true })

export default function fetchIntegrations() {
  return pg.transaction(async (trx) => {
    const integration = await pg
      .select([
        'account_id',
        'state',
        'failed_fetches',
        'last_fetch',
        'vendor_ids',
        'access_token',
      ])
      .from('integrations')
      .where('provider_id', 'apple')
      .andWhere('state', '<', 'suspended')
      .andWhere(
        'last_fetch',
        '<',
        dayjs().subtract(1, 'day').subtract(16, 'hour').format('YYYY-MM-DD'),
      )
      .orderBy(['state', 'failed_fetches', 'last_fetch'])
      .limit(1)
      .forUpdate()
      .skipLocked()
      .first()
      .transacting(trx)

    if (!integration) {
      logger.info('No integrations to process')

      return false
    }

    const traceId = `${integration.account_id}-${dayjs(integration.last_fetch).format('DD/MM/YYYY')}`

    logger.info(
      `Processing ${integration.account_id} with last fetch date ${dayjs(
        integration.last_fetch,
      ).format('YYYY-MM-DD')}`,
    )

    const vendor_id = integration.vendor_ids[0]
    let state = 'active'
    let failed_fetches = 0
    let next_day = dayjs(integration.last_fetch).add(1, 'day')
    let transactions = null
    let error_message = null

    try {
      performance.mark(`${traceId}-network-started`)
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
      performance.mark(`${traceId}-network-ended`)
      performance.measure(`network-request`, `${traceId}-network-started`, `${traceId}-network-ended`)
    } catch (error) {
      if (!error.message.includes('404')) {
        state = 'error'
        failed_fetches = integration.failed_fetches + 1
        error_message = error.message
        // We must try to fetch the same date again.
        next_day = dayjs(integration.last_fetch)

        logger.error(error)
      }
    }

    if (transactions) {
      const valid_transactions = _.orderBy(
        // somehow, some transactions doesn't have any eventDate or subscriberId.
        // eliminate those faulty transactions. TODO: investigate this.
        transactions.filter((t) => !!t.eventDate),
        ['eventDate', 'refund'],
        ['asc', 'desc'],
      )

      const applications = transactions.reduce((i, t) => {
        i[t.appAppleId] = {
          application_id: t.appAppleId,
          default_country_id: 'us',
          default_language_id: 'EN',
        }

        return i
      }, {})

      performance.mark('processing-transactions')
      await Promise.all([
        processTransactions(trx, integration.account_id, valid_transactions),
        subscriber.store.applications.create(Object.values(applications)),
      ])
      performance.mark('processing-transactions-ended')
      performance.measure('processing-transactions', 'processing-transactions', 'processing-transactions-ended')
    }

    await pg
      .into('integrations')
      .where({
        provider_id: 'apple',
        account_id: integration.account_id,
      })
      .update({
        state: state,
        failed_fetches: failed_fetches,
        last_fetch: next_day.format('YYYY-MM-DD'),
        last_error_message: error_message,
      })
      .transacting(trx)

    return integration.state !== state || integration.last_fetch !== next_day
  })
}

async function processTransactions(trx, account_id, transactions) {
  const traceId = `${account_id}-transactions`
  performance.mark(`${traceId}-transactions-insert`)
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
  performance.mark(`${traceId}-transactions-insert-ended`)
  performance.measure('transactions.insert', `${traceId}-transactions-insert`, `${traceId}-transactions-insert-ended`)

  performance.mark(`${traceId}-subscribers-insert`)
  await pg
    .insert(
      transactions.map((t) => ({
        account_id: account_id,
        provider_id: 'apple',
        subscriber_id: t.subscriberId,
        device_type_id: slug(t.device),
        country_id: t.country.toLowerCase(),
        first_interaction: dayjs(t.eventDate).format('YYYY-MM-DD'),
        total_base_subscriber_purchase: 0,
        total_base_developer_proceeds: 0,
      })),
    )
    .into('subscribers')
    .onConflict(['account_id', 'subscriber_id'])
    .ignore()
    .transacting(trx)
  performance.mark(`${traceId}-subscribers-insert-ended`)
  performance.measure('subscribers.insert', `${traceId}-subscribers-insert`, `${traceId}-subscribers-insert-ended`)

  performance.mark(`${traceId}-subscription-packages-insert`)
  await pg
    .insert(
      transactions.map((t) => ({
        account_id: account_id,
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
  performance.mark(`${traceId}-subscription-packages-insert-ended`)
  performance.measure('subscription_packages.insert', `${traceId}-subscription-packages-insert`, `${traceId}-subscription-packages-insert-ended`)

  for (const transaction of transactions) {
    await parseTransaction(transaction, { account_id: account_id }, trx)
  }
}
