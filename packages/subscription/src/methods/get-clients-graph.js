import pg from '../pg.js'
import dayjs from 'dayjs'

export default async function getActiveClientsGraph(
  { account_id, application_id },
  { filter },
) {
  const subscriptions = pg
    .queryBuilder()
    .select(['active_period'])
    .from('client_subscriptions')
    .where(function () {
      this.where({ account_id })

      if (application_id) {
        this.andWhere({ application_id })
      }

      this.andWhereRaw('active_period && ?::date', [
        dayjs(filter?.to ?? null).format('YYYY-MM-DD'),
      ])
    })

  return pg
    .with('subscriptions', subscriptions)
    .select({
      date: 's',
      total_count: 'total_count',
      start_count: 'start_count',
      last_day_count: 'last_day_count',
    })
    .from(
      pg.raw(`
      generate_series() s, 
      lateral (
        select
          count(*) as total_count, 
          count(*) as filter (where lower(active_period) = s) as start_count,
          count(*) as filter (where upper(active_period) - interval '1 day' = s) as last_day_count
        from subscriptions where active_period @> s)
    `),
    )
}
