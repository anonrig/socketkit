import dayjs from 'dayjs'
import f from '../server.js'
import rpc from '../grpc.js'
import { appstoreQueue } from '../redis.js'
import { getActiveIntegrations } from '../methods/integrations.js'

export default async function fetchAppstoreIntegration() {
  f.log.info(`Processing daily integrations cron job`)

  const integrations = await getActiveIntegrations({
    integration_id: 'appstore-connect',
  })
  const normalized =
    integrations?.map((i) => ({
      ...i,
      access_token: i.requirement_payload.access_token,
    })) ?? []

  for (let integration of normalized) {
    try {
      f.log.info(`Processing integration ${integration.id}`)
      const transaction = await rpc.integrations.findLatestScrape({
        account_id: integration.account_id,
      })

      if (!transaction) {
        continue
      }

      const fetch_date = dayjs(transaction.fetch_date).toDate()
      const dates = getDatesBetweenDates(fetch_date, new Date())

      await appstoreQueue.addBulk(
        dates.map((date) => ({
          name: 'process-date',
          data: {
            account_id: integration.account_id,
            date: dayjs(date).format('YYYY-MM-DD'),
            access_token,
          },
        })),
      )
    } catch (error) {
      f.log.error(`Error occurred on daily-integrations task`)
      f.log.error(error)
    }
  }
}

const getDatesBetweenDates = (startDate, endDate = new Date()) => {
  let dates = []
  const theDate = new Date(startDate)
  while (theDate < endDate) {
    dates = [...dates, new Date(theDate)]
    theDate.setDate(theDate.getDate() + 1)
  }
  return dates
}
