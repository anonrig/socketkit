import pg from '../pg.js'

export default async function findOne({ application_id, bundle_id }) {
  return pg
    .queryBuilder()
    .select({
      application_id: 'a.application_id',
      developer_id: 'a.developer_id',
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
      released_at: 'v.released_at',
      updated_at: 'v.updated_at',
    })
    .from('applications as a')
    .innerJoin('application_versions as v', function () {
      this.on('v.application_id', 'a.application_id')
    })
    .join('application_ratings as r', function () {
      this.on('r.application_id', 'a.application_id').andOn(
        'r.country_id',
        'v.country_id',
      )
    })
    .where(function () {
      if (application_id?.length > 0) {
        this.where('a.application_id', application_id)
      }

      if (bundle_id?.length > 0) {
        this.andWhere('a.bundle_id', bundle_id)
      }
    })
    .orderBy('v.released_at', 'desc')
    .first()
}
