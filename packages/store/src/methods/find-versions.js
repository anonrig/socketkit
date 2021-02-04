export default async function findVersions({ application_id }) {
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
      ratings: 'application_versions.rating_histogram',
      released_at: 'application_versions.released_at',
      updated_at: 'application_versions.updated_at',
    })
    .from('application_versions')
    .innerJoin('applications', function () {
      this.on(
        'application_versions.application_id',
        'applications.application_id',
      )
    })
    .where(function () {
      if (application_id) {
        this.where('applications.application_id', application_id)
      }

      if (bundle_id) {
        this.where('applications.bundle_id', bundle_id)
      }
    })
    .orderBy('application_versions.released_at', 'desc')
}
