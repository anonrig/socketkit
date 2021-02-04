import pg from '../../pg.js'
import { createApplication } from './create.js'
import { processApplication } from './process.js'

export async function findOne({
  request: {
    where: { application_id, bundle_id },
  },
}) {
  return pg
    .queryBuilder()
    .select({
      application_id: 'applications.application_id',
      developer_id: 'applications.developer_id',
      bundle_id: 'applications.bundle_id',
      application_title: 'application_versions.title',
      application_description: 'application_versions.description',
      ratings: 'application_versions.rating_histogram',
    })
    .from('applications')
    .innerJoin('application_versions', function () {
      this.on(
        'application_versions.application_id',
        'applications.application_id',
      )
    })
    .join('application_ratings', function () {
      this.on('application_ratings.application_id', application_id).andOn(
        'application_ratings.country_id',
        'application_versions.country_id',
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
    .first()
}

export async function findVersions({ application_id }) {
  return pg
    .queryBuilder()
    .select({
      // application_id: 'applications.application_id',
      // developer_id: 'applications.developer_id',
      // bundle_id: 'applications.bundle_id',
    })
    .from('application_versions')
    .where(function () {
      this.where('application_versions.application_id', application_id)
    })
    .orderBy('application_versions.released_at', 'desc')
}

export async function create({
  request: {
    where: { application_id, country_id },
  },
}) {
  return createApplication({ application_id, country_id })
}

export async function process({
  request: {
    where: { application_id, country_id },
  },
}) {
  return processApplication({ application_id, country_id })
}
