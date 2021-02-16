import dayjs from 'dayjs'
import pg from '../pg.js'

export default async function getCountries({
  account_id,
  application_id,
  start_date,
  end_date,
}) {
  if (application_id?.length == 0) {
    throw new Error(`application_id is required`)
  }

  return pg
    .queryBuilder()
    .select([
      pg.raw('c.country_id AS country_id'),
      pg.raw('c.name AS country_name'),
      pg.raw('c.coordinates AS country_coordinates'),
      pg.raw('count(*) AS total_count'),
      pg.raw(
        'count(*) FILTER (WHERE lower(s.active_period) + s.free_trial_duration < upper(s.active_period)) AS trial_past_count',
      ),
      pg.raw(
        'count(*) FILTER (WHERE upper(s.active_period) < ?) AS churn_count',
        [dayjs(end_date).format('YYYY-MM-DD')],
      ),
      pg.raw(`sum(s.total_base_developer_proceeds) AS revenue`),
    ])
    .from('clients AS cl')
    .innerJoin('client_subscriptions AS s', function () {
      this.on('s.client_id', 'cl.client_id').andOn(
        's.account_id',
        'cl.account_id',
      )
    })
    .join('countries AS c', 'c.country_id', 'cl.country_id')
    .where(function () {
      this.where('s.account_id', account_id)

      if (start_date && end_date) {
        this.andWhereRaw('s.active_period && daterange(?, ?)', [
          dayjs(start_date).format('YYYY-MM-DD'),
          dayjs(end_date).format('YYYY-MM-DD'),
        ])
      }

      if (application_id) {
        this.andWhere('s.application_id', application_id)
      }
    })
    .orderBy('revenue', 'DESC')
    .groupBy(['c.country_id'])
}
