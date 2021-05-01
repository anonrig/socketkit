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
      pg.raw('count(*) AS total_count'),
      pg.raw(
        `count(*) FILTER (WHERE s.free_trial_duration = '00:00:00') AS total_direct_sale_count`,
      ),
      pg.raw(
        `count(*) FILTER (WHERE s.free_trial_duration > '00:00:00') AS total_trial_count`,
      ),
      pg.raw(
        `count(*) FILTER (WHERE s.free_trial_duration = '00:00:00' AND s.subscription_expired_at < ?)
          AS churned_from_direct_sale`,
        [end_date],
      ),
      pg.raw(
        `count(*) FILTER (WHERE s.subscription_started_at + s.free_trial_duration >= s.subscription_expired_at
          AND s.free_trial_duration > '00:00:00' AND s.subscription_expired_at < ?)
          AS churned_from_trial`,
        [end_date],
      ),
      pg.raw(
        `count(*) FILTER (WHERE s.subscription_started_at + s.free_trial_duration < s.subscription_expired_at
          AND s.free_trial_duration > '00:00:00'
          AND (s.subscription_started_at + s.free_trial_duration)::date <@ daterange(?, ?))
          AS paid_converted_from_trial`,
        [start_date, end_date],
      ),
      pg.raw(`sum(s.total_base_developer_proceeds) AS revenue`),
    ])
    .from('clients AS c')
    .innerJoin('subscriptions AS s', function () {
      this.on('s.client_id', 'c.client_id').andOn(
        's.account_id',
        'c.account_id',
      )
    })
    .where('s.account_id', account_id)
    .andWhereRaw(`active_period && daterange(?, ?)`, [start_date, end_date])
    .andWhere(function () {
      if (application_id) {
        this.andWhere('s.application_id', application_id)
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
            ' WHERE subscription_started_at + free_trial_duration = subscription_expired_at' +
            ') AS total_trial',
        ),
        pg.raw(
          'count(*) FILTER (' +
            ' WHERE daterange(' +
            '   subscription_started_at,' +
            '   (subscription_started_at + free_trial_duration)::date' +
            ') @> ?::date) AS current_trial',
          [end_date || 'today'],
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
                  ' WHERE daterange(' +
                  '   subscription_started_at,' +
                  '   (subscription_started_at + free_trial_duration)::date' +
                  ') @> ?::date) AS at_start_trial',
                [start_date],
              ),
            ]
          : [],
      ),
    )
    .from('subscriptions')
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
