import grpc from '@grpc/grpc-js'

import pg from '../pg.js'
import * as AppStore from '../requests/app-store.js'
import * as Applications from '../models/applications.js'
import * as Reviews from '../models/reviews.js'
import * as Integrations from '../models/integrations.js'

export async function findIntegrations(ctx) {
  const { account_id } = ctx.req
  ctx.res = {
    rows: await Integrations.findAll({ account_id }),
  }
}

export async function findIntegration(ctx) {
  const { account_id, application_id, country_id } = ctx.req
  ctx.res = {
    row: await pg.transaction((trx) =>
      Integrations.findOne({ account_id, application_id, country_id }, trx),
    ),
  }
}

export async function deleteIntegration(ctx) {
  const { account_id, application_id, country_id } = ctx.req
  await pg.transaction((trx) =>
    Integrations.destroy({ account_id, application_id, country_id }, trx),
  )
  ctx.res = {}
}

export async function createIntegration(ctx) {
  const { account_id, application_id, country_id } = ctx.req

  ctx.res = await pg.transaction(async (trx) => {
    const [internal] = await Applications.exist([application_id], trx, [
      'application_id',
      'is_active',
    ])

    if (!internal) {
      const appstore = await AppStore.scrapeApp(app.application_id, 'us', 'EN')

      if (!appstore) {
        const error = new Error(`Application is not available on US AppStore`)
        error.code = grpc.status.NOT_FOUND
        throw error
      }
    } else if (!internal.is_active) {
      const error = new Error(`Application is not actively tracked`)
      error.code = grpc.status.FAILED_PRECONDITION
      throw error
    }

    await Integrations.create({ account_id, application_id, country_id }, trx)

    return {}
  })
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
  const rows = await Applications.findAll({
    application_ids: [application_id].filter(Boolean),
    bundle_ids: [bundle_id].filter(Boolean),
  })
  ctx.res = { row: rows[0] }
}

export async function findVersions(ctx) {
  const { application_id, bundle_id } = ctx.req
  ctx.res = {
    rows: await Applications.findVersions({
      application_id,
      bundle_id,
    }),
  }
}

export async function findVersion(ctx) {
  const { application_id, bundle_id, version } = ctx.req
  ctx.res = {
    row: await Applications.findVersion({ application_id, bundle_id, version }),
  }
}

export async function findReviews(ctx) {
  const { application_id, country_id, version } = ctx.req
  ctx.res = {
    rows: await Reviews.findAll({ application_id, country_id, version }),
  }
}

export async function create(ctx) {
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
        AppStore.scrapeApp(
          app.application_id,
          app.default_country_id,
          app.default_language_id,
        ),
      ),
    )

    const normalized = scraped_apps.filter((a) => !!a)

    if (normalized.length === 0) {
      return
    }

    await Applications.create(trx, normalized)
  })
}
