import pg from '../pg.js'
import dayjs from 'dayjs'
import getTrialClientCount from './get-trial-client-count.js'

export default async function getTrialConversions(
  { account_id, application_id },
  { filter },
) {
  const { total_count, trial_past_count } = await getTrialClientCount(
    { account_id, application_id },
    { filter },
  )

  return parseFloat(
    ((trial_past_count / total_count) * 100).toFixed(2) ?? '0.00',
  )
}
