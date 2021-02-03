import pg from '../pg.js'
import dayjs from 'dayjs'

export default async function getActiveClientCount(
  { account_id, application_id },
  { filter },
) {
  const { count } = await pg
    .queryBuilder()
    .countDistinct('client_id')
    .from('client_subscriptions')
    .where(function () {
      this.where({ account_id })

      if (application_id) {
        this.andWhere({ application_id })
      }

      this.andWhereRaw('active_period @> ?::date', [
        dayjs(filter?.to ?? null).format('YYYY-MM-DD'),
      ])
    })
    .first()

  return parseInt(count ?? '0')
}
