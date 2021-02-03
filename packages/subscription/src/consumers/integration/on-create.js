import dayjs from 'dayjs'
import { appstoreQueue } from '../../redis.js'
import { getDateRange } from '../../date-range.js'

export default async function onIntegrationCreate({
  account_id,
  access_token,
}) {
  const range = getDateRange(
    dayjs().subtract(9, 'month').toDate(),
    dayjs().toDate(),
  )

  await appstoreQueue.addBulk(range.map(date => ({
    name: 'process-date',
    data: { account_id, access_token, date },
    opts: {
      removeOnComplete: true,
      removeOnFail: true
    }
  })))
}
