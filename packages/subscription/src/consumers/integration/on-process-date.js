import Logger from '../../logger.js'
import AppStoreReporter, {
  ReportType,
  ReportSubType,
  ReportDateType,
} from 'appstore-reporter'
import dayjs from 'dayjs'
import { parseTransaction } from './parse-transaction.js'
import pg from '../../pg.js'

const logger = Logger.create().withScope('on-process-date')
export default async function onProcessDate(
  { date, account_id, access_token },
  trx,
) {
  let vendorId = null

  const reporter = new AppStoreReporter.default({ accessToken: access_token })
  const preferences = await pg
    .select('*')
    .from('account_provider_preferences')
    .where({ account_id, provider_id: 'apple' })
    .first()
    .transacting(trx)

  if (preferences) {
    vendorId = preferences.vendor_id
  } else {
    const available_vendor_ids = await reporter.sales.getVendors()
    await pg
      .insert({
        account_id,
        provider_id: 'apple',
        vendor_id: available_vendor_ids[0],
        available_vendor_ids,
      })
      .into('account_provider_preferences')
      .onConflict(['account_id', 'provider_id'])
      .ignore()
      .transacting(trx)
    vendorId = available_vendor_ids[0]
  }

  if (!vendorId) {
    throw new Error(`Vendor id not found`)
  }

  // get fetch log for event date.
  const processed = await pg
    .select('*')
    .from('vendor_fetch_logs')
    .where({
      account_id,
      vendor_id: vendorId,
      fetch_date: dayjs(date).format('YYYY-MM-DD'),
      successful: true,
    })
    .first()
    .transacting(trx)

  if (processed) {
    return logger.info(
      `Already processed date=${dayjs(date).format(
        'YYYY-MM-DD',
      )} for account_id=${account_id}`,
    )
  }

  logger.info(
    `Parsing date=${dayjs(date).format(
      'YYYY-MM-DD',
    )} for account_id=${account_id}`,
  )

  try {
    const transactions = await reporter.sales.getReport({
      vendorNumber: vendorId,
      reportType: ReportType.subscriber,
      reportSubType: ReportSubType.detailed,
      dateType: ReportDateType.daily,
      date: dayjs(date).format('YYYYMMDD'),
      reportVersion: '1_2',
    })

    for (const transaction of transactions) {
      await parseTransaction(transaction, { account_id }, trx)
    }

    // create vendor fetch log
    await pg
      .insert({
        account_id,
        vendor_id: vendorId,
        fetch_date: dayjs(date).format('YYYY-MM-DD'),
        successful: true,
        payload: {},
      })
      .into('vendor_fetch_logs')
      .onConflict(['account_id', 'vendor_id', 'fetch_date', 'successful'])
      .merge()
      .transacting(trx)
  } catch (error) {
    if (error.message.includes('404')) {
      await pg
        .insert({
          account_id,
          vendor_id: vendorId,
          fetch_date: dayjs(date).format('YYYY-MM-DD'),
          successful: true,
          payload: {},
        })
        .into('vendor_fetch_logs')
        .onConflict(['account_id', 'vendor_id', 'fetch_date', 'successful'])
        .merge()
        .transacting(trx)
      logger.debug('Could not find any transactions on Appstore')
    } else if (error.message.includes('401')) {
      logger.warn('Permission denied')
      throw error
    } else {
      logger.error(error)
      throw error
    }
  }

  return { result: 'processed' }
}
