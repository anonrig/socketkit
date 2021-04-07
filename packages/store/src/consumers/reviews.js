import _ from 'lodash'
import dayjs from 'dayjs'
import * as Reviews from '../models/reviews.js'

export async function findAll(ctx) {
  const {
    application_ids,
    country_ids,
    version_ids,
    cursor,
    start_date,
    end_date,
  } = ctx.req
  const rows = await Reviews.findAll(
    { application_ids, country_ids, version_ids },
    { cursor, start_date, end_date },
  )

  const latest = _.last(rows)

  ctx.res = {
    rows,
    cursor: latest
      ? {
          review_id: latest.review_id,
          updated_at: dayjs(latest.updated_at).format('YYYY-MM-DD'),
        }
      : null,
  }
}

export async function findVersions(ctx) {
  const { application_id } = ctx.req
  ctx.res = {
    rows: await Reviews.findVersions({ application_id }),
  }
}

export async function findCountries(ctx) {
  const { account_id, application_id } = ctx.req
  ctx.res = {
    rows: await Reviews.findCountries({ account_id, application_id }),
  }
}
