import logger from '../logger.js'
import pg from '../pg.js'
import scrape from '../requests/app-store.js'
import * as Applications from '../models/applications.js'
import * as Reviews from '../models/reviews.js'

export async function findAll(ctx) {
  const { application_ids, bundle_ids, developer_ids } = ctx.req
  ctx.res = {
    rows: await Applications.findAll({
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
    rows: await Applications.findVersions({ application_id, bundle_id }),
  }
}

export async function findReviews(ctx) {
  const { application_id, country_id, version } = ctx.req
  ctx.res = {
    rows: await Reviews.findAll({ application_id, country_id, version }),
  }
}

export function create(ctx) {
  return pg.transaction(async (trx) => {
    const existing_application_ids = await Applications.exist(
      trx,
      ctx.req.rows.map((a) => a.application_id),
    )

    const scraped_apps = await scrape(
      ctx.req.rows.filter(
        (a) => !existing_application_ids.includes(a.application_id),
      ),
    )

    await Applications.create(trx, scraped_apps)
  })
}
