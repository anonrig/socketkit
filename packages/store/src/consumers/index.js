import * as Applications from '../models/applications.js'
import * as Reviews from '../models/reviews.js'
import pg from '../pg.js'
import scraper from 'app-store-scraper'
import logger from '../logger.js'

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
  const { application_id, country_id } = ctx.req

  return pg.transaction(async (trx) => {
    const existing_application_ids = await Applications.exist(trx, [
      application_id,
    ])

    if (existing_application_ids.length > 0) return

    try {
      const scraped_app = await scraper.app({
        id: application_id,
        ratings: true,
      })

      await Applications.create(scraped_app, country_id, trx)
    } catch (error) {
      if (!error.message.includes('404')) {
        logger.error(error)
        throw error
      }
    }
  })
}
