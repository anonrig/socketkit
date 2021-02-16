import pg from '../pg.js'

export function count({ account_id, application_id, start_date, end_date }) {
  return pg
    .queryBuilder()
    .select(
      [
        pg.raw('count(*) AS total'),
        pg.raw(
          'count(*) FILTER (' +
            ' WHERE lower(active_period) + free_trial_duration >= upper(active_period)' +
            ' ) AS trial',
        ),
        pg.raw('count(*) FILTER (WHERE active_period @> ?::date) AS current', [
          end_date || 'today',
        ]),
      ].concat(
        start_date
          ? [
              pg.raw(
                'count(*) FILTER (WHERE active_period @> ?::date) AS at_start',
                [start_date],
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
