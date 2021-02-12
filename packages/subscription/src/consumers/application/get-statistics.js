import * as Application from '../../models/application.js'
import getActiveClientCount from '../../methods/get-active-client-count.js'
import dayjs from 'dayjs'
import getTrialClientCount from '../../methods/get-trial-client-count.js'
import pg from '../../pg.js'

export default async function ({ account_id, application_id }) {
  const application = await pg
    .queryBuilder()
    .from('applications')
    .where({ account_id, application_id })
    .first()

  if (!application) {
    throw new Error(`Application not found`)
  }

  const [subscribers, trials, mrr] = await Promise.all([
    getActiveClientCount(
      { account_id, application_id },
      { filter: { to: new Date() } },
    ),
    getTrialClientCount(
      { account_id, application_id },
      {
        filter: {
          from: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
          to: dayjs().format('YYYY-MM-DD'),
        },
      },
    ),
    Application.totalSales(
      { account_id, application_id },
      {
        filter: {
          from: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
          to: dayjs().format('YYYY-MM-DD'),
        },
      },
    ),
  ])

  return {
    subscribers,
    trials: trials.total_count - trials.trial_past_count,
    mrr,
  }
}
