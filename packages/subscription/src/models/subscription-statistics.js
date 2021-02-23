import pg from '../pg.js'

export function groupByCountry({
  account_id,
  application_id,
  start_date,
  end_date,
}) {
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
        [end_date || 'today'],
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

      if (application_id) {
        this.andWhere('s.application_id', application_id)
      }

      if (start_date) {
        this.andWhereRaw(`active_period && daterange(?, ?, '[]')`, [
          start_date,
          end_date || 'today',
        ])
      } else if (end_date) {
        this.andWhereRaw('active_period @> ?', [end_date])
      }
    })
    .orderBy('revenue', 'DESC')
    .groupBy(['c.country_id'])
}

export function count({ account_id, application_id, start_date, end_date }) {
  return pg
    .queryBuilder()
    .select(
      [
        pg.raw('count(*) AS total'),
        pg.raw('count(*) FILTER (WHERE active_period @> ?::date) AS current', [
          end_date || 'today',
        ]),
        pg.raw(
          'count(*) FILTER (' +
            ' WHERE lower(active_period) + free_trial_duration >= upper(active_period)' +
            ') AS total_trial',
        ),
        pg.raw(
          'count(*) FILTER (' +
            ' WHERE lower(active_period) >= ?::date' +
            ' AND lower(active_period) + free_trial_duration <= ?::date' +
            ') AS current_trial',
          [end_date || 'today', end_date || 'today'],
        ),
      ].concat(
        start_date
          ? [
              pg.raw(
                'count(*) FILTER (WHERE active_period @> ?::date) AS at_start',
                [start_date],
              ),
              pg.raw(
                'count(*) FILTER (' +
                  ' WHERE lower(active_period) >= ?::date' +
                  ' AND lower(active_period) + free_trial_duration <= ?::date' +
                  ') AS at_start_trial',
                [start_date, start_date],
              ),
            ]
          : [],
      ),
    )
    .from('client_subscriptions')
    .where(function () {
      this.where({ account_id })

      if (application_id) {
        this.andWhere({ application_id })
      }

      if (start_date) {
        this.andWhereRaw(`active_period && daterange(?, ?, '[]')`, [
          start_date,
          end_date || 'today',
        ])
      } else if (end_date) {
        this.andWhereRaw('active_period @> ?', [end_date])
      }
    })
    .first()
}
