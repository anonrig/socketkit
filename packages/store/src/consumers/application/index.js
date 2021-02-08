import findOneApplication from '../../methods/find-one.js'
import findApplicationVersions from '../../methods/find-versions.js'
import createApplication from '../../methods/create-application.js'
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
    callback(
      null,
      await pg.transaction(async (trx) => {
        try {
          return createApplication({ application_id, country_id }, trx)
        } catch (error) {
          trx.rollback(error)
        }
      }),
    )
  } catch (error) {
    logger.withTag('create').error(error)
    callback(error)
  }
}
