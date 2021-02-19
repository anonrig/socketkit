import dayjs from 'dayjs'
import Logger from '../logger.js'
import rpc from '../grpc.js'
import { appstoreQueue } from '../redis.js'
import { getActiveIntegrations } from '../methods/integrations.js'

const logger = Logger.create().withScope('daily-integrations')

export default async function fetchAppstoreIntegration() {
  logger.info(`Processing daily integrations cron job`)

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
      const scrape = await rpc.integrations.findLatestScrape({
        account_id: integration.account_id,
      })

      if (!scrape.row) {
        logger
          .withTag('first-time')
          .info(`Processing integration for ${integration.account_id}`)

        await rpc.integrations.create({
          account_id: integration.account_id,
          access_token: integration.access_token,
        })
      } else {
        logger
          .withTag('existing')
          .info(`Processing integration for ${integration.account_id}`)

        const fetch_date = dayjs(scrape.row.fetch_date).toDate()
        const dates = getDatesBetweenDates(fetch_date, new Date())

        await appstoreQueue.addBulk(
          dates.map((date) => ({
            name: 'process-date',
            data: {
              account_id: integration.account_id,
              date: dayjs(date).format('YYYY-MM-DD'),
              access_token: integration.access_token,
            },
          })),
        )
      }
    } catch (error) {
      logger.error(error)
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
