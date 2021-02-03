import pg from '../pg.js'
import dayjs from 'dayjs'

export default async function getTrialClientCount(
  { account_id, application_id },
  { filter },
) {
  const { total_count, trial_past_count } = await pg
    .queryBuilder()
    .select([
      pg.raw('count(*) as total_count'),
      pg.raw(
        'count(*) filter (WHERE lower(active_period) + free_trial_duration < upper(active_period)) as trial_past_count',
      ),
    ])
    .from('client_subscriptions')
    .where(function () {
      this.where('client_subscriptions.account_id', account_id)

      // Make sure that it is a free trial subscription
      this.andWhereNot('client_subscriptions.free_trial_duration', '00:00:00')

      if (application_id) {
        this.andWhere('client_subscriptions.application_id', application_id)
      }

      if (filter?.from && filter?.to) {
        const fields = [
          dayjs(filter.from).format('YYYY-MM-DD'),
          dayjs(filter.to).format('YYYY-MM-DD'),
        ]
        this.andWhereRaw(
          'client_subscriptions.active_period &> daterange(?, ?)',
          fields,
        )
        this.andWhereRaw(
          'client_subscriptions.active_period && daterange(?, ?)',
          fields,
        )
      }
    })
    .first()

  return {
    total_count: parseInt(total_count ?? '0'),
    trial_past_count: parseInt(trial_past_count ?? '0'),
  }
}
