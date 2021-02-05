import findOneApplication from '../../methods/find-one.js'
import findApplicationVersions from '../../methods/find-versions.js'
import createApplication from '../../methods/create-application.js'
import { processApplication } from './process.js'
import Logger from '../../logger.js'
import pg from '../../pg.js'

const logger = Logger.create().withScope('consumer')

export async function findOne(
  { request: { application_id, bundle_id } },
  callback,
) {
  logger.withTag('findOne').info('Received event')
  try {
    callback(null, await findOneApplication({ application_id, bundle_id }))
  } catch (error) {
    logger.withTag('findOne').error(error)
    callback(error)
  }
}

export async function findVersions(
  { request: { application_id, bundle_id } },
  callback,
) {
  logger.withTag('findVersions').info('Received event')
  try {
    callback(null, {
      versions: await findApplicationVersions({ application_id, bundle_id }),
    })
  } catch (error) {
    logger.withTag('findVersions').error(error)
    callback(error)
  }
}

export async function create(
  { request: { application_id, country_id } },
  callback,
) {
  logger.withTag('create').info('Received event')
  try {
    callback(null, await createApplication({ application_id, country_id }))
  } catch (error) {
    logger.withTag('create').error(error)
    callback(error)
  }
}

export async function process(
  { request: { application_id, country_id } },
  callback,
) {
  logger.withTag('process').info('Received event')
  try {
    callback(null, await pg.transaction(async trx => {
      await processApplication(trx, application_id, country_id)
    }))
  } catch (error) {
    logger.withTag('process').error(error)
    callback(error)
  }
}
