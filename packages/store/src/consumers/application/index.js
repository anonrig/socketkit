import findOneApplication from '../../methods/find-one.js'
import findApplicationVersions from '../../methods/find-versions.js'
import findAllApplications from '../../methods/find-all.js'
import createApplication from '../../methods/create-application.js'
import pg from '../../pg.js'

export async function findAll(ctx) {
  const { application_ids, bundle_ids, developer_ids } = ctx.req
  ctx.res = {
    rows: await findAllApplications({
      application_ids,
      bundle_ids,
      developer_ids,
    }),
  }
}

export async function findOne(ctx) {
  const { application_id, bundle_id } = ctx.req
  ctx.res = { row: await findOneApplication({ application_id, bundle_id }) }
}

export async function findVersions(ctx) {
  const { application_id, bundle_id } = ctx.req
  ctx.res = {
    rows: await findApplicationVersions({ application_id, bundle_id }),
  }
}

export async function create(ctx) {
  const { application_id, country_id } = ctx.req
  ctx.res = {
    row: await pg.transaction((trx) =>
      createApplication({ application_id, country_id }, trx),
    ),
  }
}
