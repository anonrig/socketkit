import pg from '../pg.js'

export default async function findAll({ application_ids, bundle_ids }) {
  return pg
    .queryBuilder()
    .select({
      application_id: 'applications.application_id',
      developer_id: 'applications.developer_id',
      bundle_id: 'applications.bundle_id',
      title: 'application_versions.title',
      description: 'application_versions.description',
      release_notes: 'application_versions.release_notes',
      icon: 'application_versions.icon',
      store_url: 'application_versions.store_url',
      languages: 'application_versions.languages',
      screenshots: 'application_versions.screenshots',
      version: 'application_versions.version',
      ratings: 'application_ratings.rating_histogram',
      released_at: 'application_versions.released_at',
      updated_at: 'application_versions.updated_at',
    })
    .from('applications')
    .joinRaw(
      `
      cross join lateral (
        select *
        from application_versions
        where application_id = applications.application_id
        order by released_at desc
        limit 1
      ) as application_versions
    `,
    )
    .join('application_ratings', function () {
      this.on(
        'application_ratings.application_id',
        'applications.application_id',
      ).andOn(
        'application_ratings.country_id',
        'application_versions.country_id',
      )
    })
    .where(function () {
      if (application_ids && application_ids.length) {
        this.whereIn('applications.application_id', application_ids)
      }

      if (bundle_ids && bundle_ids.length) {
        this.whereIn('applications.bundle_id', bundle_ids)
      }
    })
    .orderBy('application_versions.released_at', 'desc')
}
