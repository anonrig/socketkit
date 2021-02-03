import dayjs from 'dayjs'
import pg from '../pg.js'

export default async function getCountries(
  { account_id, application_id },
  { filter },
) {
  return pg
    .queryBuilder()
    .select([
      pg.raw('countries.country_id as country_id'),
      pg.raw('countries.name as country_name'),
      pg.raw('countries.coordinates as country_coordinates'),
      pg.raw('count(*) as total_count'),
      pg.raw(
        'count(*) filter (WHERE lower(active_period) + free_trial_duration < upper(active_period)) as trial_past_count',
      ),
      pg.raw(
        'count(*) filter (WHERE upper(active_period) < ?) as churn_count',
        [dayjs(filter?.to).format('YYYY-MM-DD')],
      ),
      pg.raw(
        `sum(client_subscriptions.total_base_developer_proceeds) as revenue`,
      ),
    ])
    .from('clients')
    .innerJoin('client_subscriptions', function () {
      this.on('client_subscriptions.client_id', 'clients.client_id').andOn(
        'client_subscriptions.account_id',
        'clients.account_id',
      )
    })
    .join('countries', 'countries.country_id', 'clients.country_id')
    .where(function () {
      this.where('client_subscriptions.account_id', account_id)

      if (filter?.from && filter?.to) {
        this.andWhereRaw(
          'client_subscriptions.active_period && daterange(?, ?)',
          [
            dayjs(filter.from).format('YYYY-MM-DD'),
            dayjs(filter.to).format('YYYY-MM-DD'),
          ],
        )
      }

      if (application_id) {
        this.andWhere('client_subscriptions.application_id', application_id)
      }
    })
    .orderBy('revenue', 'desc')
    .groupBy(['countries.country_id'])
}
