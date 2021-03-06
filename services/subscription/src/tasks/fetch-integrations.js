import { randomUUID } from 'node:crypto'
import { performance } from 'perf_hooks'

import AppStoreReporter from 'appstore-reporter'
import _ from 'lodash'
import slug from 'slug'

import { getExchangeRates } from '../fixer.js'
import subscriber from '../grpc-client.js'
import Logger from '../logger.js'
import RevenueList from '../models/revenue-list.js'
import Transaction from '../models/transaction.js'
import pg from '../pg/index.js'
import {
  invalidate as invalidateRevenues,
  insertCurrentDay as insertCurrentDayRevenues,
} from '../pg/revenues-maintain.js'
import insertTransaction from '../pg/transaction-insert.js'
import { ISODate } from '../types.js'

const logger = Logger.create().withScope('fetch-integrations')

export default function fetchIntegrations() {
  return pg.transaction(async (trx) => {
    const traceId = randomUUID()
    const integration = await pg
      .select(['account_id', 'state', 'failed_fetches', 'last_fetch', 'vendor_ids', 'access_token'])
      .from('integrations')
      .where('provider_id', 'apple')
      .andWhere('state', '<', 'suspended')
      .andWhere('last_fetch', '<', ISODate.today().subtract(1, 'day').subtract(16, 'hour'))
      .orderBy(['state', 'failed_fetches', 'last_fetch'])
      .limit(1)
      .forUpdate()
      .skipLocked()
      .first()
      .transacting(trx)

    if (!integration) {
      return false
    }

    const vendor_id = integration.vendor_ids[0]
    let state = 'active'
    let failed_fetches = 0
    let next_day = integration.last_fetch.add(1, 'day')
    let transactions = null
    let error_message = null

    logger.info(`Processing ${integration.account_id} for ${next_day}`)

    try {
      performance.mark(`${traceId}-network-started`)
      const reporter = new AppStoreReporter.default({
        accessToken: integration.access_token,
      })
      transactions = await reporter.sales.getReport({
        date: next_day.format('YYYYMMDD'),
        dateType: 'Daily',
        reportSubType: 'Detailed',
        reportType: 'Subscriber',
        reportVersion: '1_2',
        vendorNumber: vendor_id,
      })
      performance.mark(`${traceId}-network-ended`)
      performance.measure(
        `network-request`,
        `${traceId}-network-started`,
        `${traceId}-network-ended`,
      )
    } catch (error) {
      const isNotFound = error.message.includes('404')
      const isBadRequest = error.message.includes('400')
      const isPermissionFailed = error.message.includes('403')

      if (!isNotFound) {
        state = 'error'
        failed_fetches = integration.failed_fetches + 1
        error_message = error.message
        // We must try to fetch the same date again.
        next_day = integration.last_fetch

        if (!isBadRequest && !isPermissionFailed) {
          logger.error(error)
        }

        if (isPermissionFailed) {
          // @TODO: Send a notification to user about failed integration.
        }
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

      const application_ids = _.uniqBy(transactions, 'appAppleId').map((t) => ({
        application_id: t.appAppleId,
        default_country_id: 'us',
        default_language_id: 'EN',
      }))

      performance.mark(`${traceId}-processing`)

      const createApplicationTask =
        application_ids.length > 0
          ? subscriber.store.applications.create({ rows: application_ids })
          : Promise.resolve()
      await Promise.all([
        processTransactions(
          {
            account_id: integration.account_id,
            next_day,
            transactions: valid_transactions,
          },
          trx,
        ),
        createApplicationTask,
      ])
      performance.mark(`${traceId}-processing-ended`)
      performance.measure(
        'processing-transactions',
        `${traceId}-processing`,
        `${traceId}-processing-ended`,
      )
    }

    await pg
      .into('integrations')
      .where({
        account_id: integration.account_id,
        provider_id: 'apple',
      })
      .update({
        failed_fetches: failed_fetches,
        last_error_message: error_message,
        last_fetch: next_day,
        state: state,
      })
      .transacting(trx)

    return integration.state !== state || !integration.last_fetch.isSame(next_day, 'day')
  })
}

async function processTransactions({ account_id, transactions, next_day }, trx) {
  const exchange_rates = await getExchangeRates(next_day)

  await pg
    .insert(
      _.uniqBy(transactions, 'device').map((t) => ({
        device_type_id: slug(t.device),
        name: t.device,
        provider_id: 'apple',
      })),
    )
    .into('device_types')
    .onConflict(['provider_id', 'device_type_id'])
    .ignore()
    .transacting(trx)

  await pg
    .insert(
      _.uniqBy(transactions, 'subscriberId').map((t) => ({
        account_id: account_id,
        country_id: t.country.toLowerCase(),
        device_type_id: slug(t.device),
        first_interaction: t.eventDate,
        provider_id: 'apple',
        subscriber_id: t.subscriberId,
        total_base_developer_proceeds: 0,
        total_base_subscriber_purchase: 0,
      })),
    )
    .into('subscribers')
    .onConflict(['account_id', 'subscriber_id'])
    .ignore()
    .transacting(trx)

  await pg
    .insert(
      _.uniqBy(transactions, 'subscriptionAppleId').map((t) => ({
        account_id: account_id,
        application_id: t.appAppleId,
        name: t.subscriptionName,
        subscription_duration: t.standardSubscriptionDuration,
        subscription_group_id: t.subscriptionGroupId,
        subscription_package_id: t.subscriptionAppleId,
      })),
    )
    .into('subscription_packages')
    .onConflict(['account_id', 'subscription_package_id'])
    .ignore()
    .transacting(trx)

  const revenue_list = new RevenueList(next_day)

  for (const raw of transactions) {
    const transaction = new Transaction(raw, exchange_rates)
    await insertTransaction(transaction, { account_id }, trx)
    revenue_list.addTransaction(transaction)
  }

  await invalidateRevenues(trx, account_id, revenue_list)
  await insertCurrentDayRevenues(trx, account_id, revenue_list)
}
