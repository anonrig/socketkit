import Logger from '../../logger.js'
import AppStoreReporter, {
  ReportType,
  ReportSubType,
  ReportDateType,
} from 'appstore-reporter'
import dayjs from 'dayjs'
import { parseTransaction } from './parse-transaction.js'
import * as AccountPreferences from '../../models/account-preference.js'
import * as VendorLogs from '../../models/vendor-fetch-logs.js'

const logger = Logger.create().withScope('on-process-date')
export default async function onProcessDate({
  date,
  account_id,
  access_token,
}) {
  let vendorId = null

  const reporter = new AppStoreReporter.default({ accessToken: access_token })
  const preferences = await AccountPreferences.findByPk({
    account_id,
    provider_id: 'apple',
  })

  if (preferences) {
    vendorId = preferences.vendor_id
  } else {
    const available_vendor_ids = await reporter.sales.getVendors()
    await AccountPreferences.create({
      account_id,
      vendor_id: available_vendor_ids[0],
      available_vendor_ids,
      provider_id: 'apple',
    })
    vendorId = available_vendor_ids[0]
  }

  if (!vendorId) {
    throw new Error(`Vendor id not found`)
  }

  const processed = await VendorLogs.findOne({
    account_id,
    vendor_id: vendorId,
    fetch_date: dayjs(date).format('YYYY-MM-DD'),
    successful: true,
  })

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
      await parseTransaction(transaction, { account_id })
    }

    await VendorLogs.create({
      account_id,
      vendor_id: vendorId,
      fetch_date: dayjs(date).format('YYYY-MM-DD'),
      successful: true,
      payload: {},
    })
  } catch (error) {
    console.error('error', error)
    if (error.message.includes('404')) {
      await VendorLogs.create({
        account_id,
        vendor_id: vendorId,
        fetch_date: dayjs(date).format('YYYY-MM-DD'),
        successful: true,
        payload: {},
      })
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
