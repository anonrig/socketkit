import pg from '../pg.js'
import dayjs from 'dayjs'

export default async function getLostClientCount(
  { account_id, application_id },
  { filter },
) {
  // TODO: Does free trial count as churn?

  const { count } = await pg
    .queryBuilder()
    .countDistinct('client_id')
    .from('client_subscriptions')
    .where(function () {
      this.where('client_subscriptions.account_id', account_id)

      if (application_id) {
        this.andWhere('client_subscriptions.application_id', application_id)
      }

      if (filter?.from && filter?.to) {
        const fields = [
          dayjs(filter.from).format('YYYY-MM-DD'),
          dayjs(filter.to).format('YYYY-MM-DD'),
        ]
        this.andWhereRaw(
          'client_subscriptions.active_period &< daterange(?, ?)',
          fields,
        )
        this.andWhereRaw(
          'client_subscriptions.active_period && daterange(?, ?)',
          fields,
        )
      }
    })
    .first()

  return parseInt(count ?? '0')
}
