import pg from '../pg.js'

export default async function findAll({
  application_ids,
  bundle_ids,
  developer_ids,
}) {
  return pg
    .queryBuilder()
    .select({
      application_id: 'a.application_id',
      developer_id: 'a.developer_id',
      developer_name: 'd.name',
      bundle_id: 'a.bundle_id',
      title: 'v.title',
      description: 'v.description',
      release_notes: 'v.release_notes',
      icon: 'v.icon',
      store_url: 'v.store_url',
      languages: 'v.languages',
      screenshots: 'v.screenshots',
      version: 'v.version',
      ratings: 'r.rating_histogram',
      released_at: 'a.released_at',
      version_released_at: 'v.released_at',
    })
    .from('applications AS a')
    .joinRaw(
      `
      CROSS JOIN LATERAL (
        SELECT *
        FROM application_versions
        WHERE application_id = a.application_id
        ORDER BY released_at DESC
        LIMIT 1
      ) AS v
    `,
    )
    .join('application_ratings as r', function () {
      this.on('r.application_id', 'a.application_id').andOn(
        'r.country_id',
        'v.country_id',
      )
    })
    .join('developers as d', 'd.developer_id', 'a.developer_id')
    .where(function () {
      if (application_ids?.length > 0) {
        this.whereIn('a.application_id', application_ids)
      }

      if (bundle_ids?.length > 0) {
        this.whereIn('a.bundle_id', bundle_ids)
      }

      if (developer_ids?.length > 0) {
        this.whereIn('d.developer_id', developer_ids)
      }
    })
    .orderBy('v.released_at', 'DESC')
}
