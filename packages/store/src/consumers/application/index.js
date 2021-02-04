import findOneApplication from '../../methods/find-one.js'
import findApplicationVersions from '../../methods/find-versions.js'
import createApplication from '../../methods/create-application.js'
import { processApplication } from './process.js'

export async function findOne(
  { request: { application_id, bundle_id } },
  callback,
) {
  try {
    callback(null, await findOneApplication({ application_id, bundle_id }))
  } catch (error) {
    callback(error)
  }
}

export async function findVersions({ request: { application_id } }, callback) {
  try {
    callback(null, await findApplicationVersions({ application_id }))
  } catch (error) {
    callback(error)
  }
}

export async function create(
  { request: { application_id, country_id } },
  callback,
) {
  try {
    callback(null, await createApplication({ application_id, country_id }))
  } catch (error) {
    callback(error)
  }
}

export async function process({
  request: {
    where: { application_id, country_id },
  },
  callback,
}) {
  try {
    callback(null, await processApplication({ application_id, country_id }))
  } catch (error) {
    callback(error)
  }
}
