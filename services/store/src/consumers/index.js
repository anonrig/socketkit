import grpc from '@grpc/grpc-js'

import * as Applications from '../models/applications.js'
import pg from '../pg.js'
import * as AppStore from '../requests/app-store.js'

export async function search(ctx) {
  const { text } = ctx.req
  ctx.res = {
    rows: await Applications.search({ text }),
  }
}

export async function findAll(ctx) {
  const { application_ids, bundle_ids, developer_ids } = ctx.req

  ctx.res = {
    rows: await Applications.findAllSimplified({
      application_ids,
      bundle_ids,
      developer_ids,
    }),
  }
}

export async function findOne(ctx) {
  const { application_id, bundle_id } = ctx.req

  if (!application_id && !bundle_id) {
    const error = new Error(`Missing conditions on Applications.findOne`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  const rows = await Applications.findAll({
    application_ids: [application_id].filter(Boolean),
    bundle_ids: [bundle_id].filter(Boolean),
  })
  ctx.res = { row: rows[0] }
}

export async function findVersions(ctx) {
  const { application_id, bundle_id } = ctx.req

  if (!application_id && !bundle_id) {
    const error = new Error(`Missing conditions on Applications.findVersions`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = {
    rows: await Applications.findVersions({
      application_id,
      bundle_id,
    }),
  }
}

export async function findVersion(ctx) {
  const { application_id, bundle_id, version } = ctx.req

  if ((!application_id && !bundle_id) || !version) {
    const error = new Error(`Missing conditions on Applications.findVersion`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = {
    row: await Applications.findVersion({ application_id, bundle_id, version }),
  }
}

export async function create(ctx) {
  if (ctx.req.rows.length === 0) {
    ctx.res = {}
    return
  }

  ctx.res = await pg.transaction(async (trx) => {
    const existing_application_ids = await Applications.exist(
      ctx.req.rows.map((a) => a.application_id),
      trx,
    )
    const new_applications = ctx.req.rows.filter(
      (a) => !existing_application_ids.includes(a.application_id),
    )

    if (new_applications.length === 0) {
      return
    }

    const scraped_apps = await Promise.all(
      new_applications.map((app) =>
        AppStore.scrapeApp(app.application_id, app.default_country_id, app.default_language_id),
      ),
    )

    const normalized = scraped_apps.filter((a) => !!a)

    if (normalized.length === 0) {
      return
    }

    await Applications.create(trx, normalized)
  })
}
