import findOneApplication from '../../methods/find-one.js'
import findApplicationVersions from '../../methods/find-versions.js'
import createApplication from '../../methods/create-application.js'
import Logger from '../../logger.js'
import pg from '../../pg.js'

export async function findOne(ctx) {
  const { application_id, bundle_id } = ctx.req
  ctx.res = await findOneApplication({ application_id, bundle_id })
}

export async function findVersions(ctx) {
  const { application_id, bundle_id } = ctx.req
  ctx.res = {
    versions: await findApplicationVersions({ application_id, bundle_id }),
  }
}

export async function create(ctx) {
  const { application_id, country_id } = ctx.req
  ctx.res = await pg.transaction((trx) =>
    createApplication({ application_id, country_id }, trx),
  )
}
