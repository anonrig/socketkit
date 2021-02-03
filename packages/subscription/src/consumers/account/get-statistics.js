import dayjs from 'dayjs'

import getRefunds from '../../methods/get-refunds.js'
import getRevenue from '../../methods/get-revenue.js'
import getActiveClientCount from '../../methods/get-active-client-count.js'

export default async function getStatistics({ account_id }) {
  const monthAgo = dayjs().subtract(1, 'month')
  const now = dayjs()

  const currentPeriodFilter = {
    from: monthAgo.format('YYYY-MM-DD'),
    to: now.format('YYYY-MM-DD'),
  }
  const previousPeriodFilter = {
    from: monthAgo.subtract(1, 'month').format('YYYY-MM-DD'),
    to: monthAgo.format('YYYY-MM-DD'),
  }

  const [refundsNow, refundsPrevious] = await Promise.all([
    getRefunds(
      { account_id },
      { filter: currentPeriodFilter, force_positiveness: true },
    ),
    getRefunds(
      { account_id },
      { filter: previousPeriodFilter, force_positiveness: true },
    ),
  ])

  const [revenueNow, revenuePrevious] = await Promise.all([
    getRevenue({ account_id }, { filter: currentPeriodFilter }),
    getRevenue({ account_id }, { filter: previousPeriodFilter }),
  ])

  const [clientsNow, clientsPrevious] = await Promise.all([
    getActiveClientCount({ account_id }, { filter: currentPeriodFilter }),
    getActiveClientCount({ account_id }, { filter: previousPeriodFilter }),
  ])

  return {
    clients: {
      now: clientsNow ?? 0,
      previous: clientsPrevious ?? 0,
      change: ((clientsNow / clientsPrevious - 1) * 100).toFixed(0),
      positive: clientsNow > clientsPrevious,
    },
    sales: {
      now: revenueNow ?? 0,
      previous: revenuePrevious ?? 0,
      change: ((revenueNow / revenuePrevious - 1) * 100).toFixed(0),
      positive: revenueNow > revenuePrevious,
    },
    refunds: {
      now: refundsNow ?? 0,
      previous: refundsPrevious ?? 0,
      change: ((refundsNow / refundsPrevious - 1) * 100).toFixed(0),
      positive: refundsNow < refundsPrevious,
    },
  }
}
