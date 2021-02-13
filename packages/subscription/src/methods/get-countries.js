import dayjs from 'dayjs'
import pg from '../pg.js'

export default async function getCountries(
  { account_id, application_id },
  { filter },
) {
  return pg
    .queryBuilder()
    .select([
      pg.raw('c.country_id as country_id'),
      pg.raw('c.name as country_name'),
      pg.raw('c.coordinates as country_coordinates'),
      pg.raw('count(*) as total_count'),
      pg.raw(
        'count(*) filter (WHERE lower(s.active_period) + s.free_trial_duration < upper(s.active_period)) as trial_past_count',
      ),
      pg.raw(
        'count(*) filter (WHERE upper(s.active_period) < ?) as churn_count',
        [dayjs(filter?.to).format('YYYY-MM-DD')],
      ),
      pg.raw(
        `sum(s.total_base_developer_proceeds) as revenue`,
      ),
    ])
    .from('clients as cl')
    .innerJoin('client_subscriptions as s', function () {
      this.on('s.client_id', 'cl.client_id').andOn(
        's.account_id',
        'cl.account_id',
      )
    })
    .join('countries as c', 'c.country_id', 'cl.country_id')
    .where(function () {
      this.where('s.account_id', account_id)

      if (filter?.from && filter?.to) {
        this.andWhereRaw(
          's.active_period && daterange(?, ?)',
          [
            dayjs(filter.from).format('YYYY-MM-DD'),
            dayjs(filter.to).format('YYYY-MM-DD'),
          ],
        )
      }

      if (application_id) {
        this.andWhere('s.application_id', application_id)
      }
    })
    .orderBy('revenue', 'desc')
    .groupBy(['c.country_id'])
}
