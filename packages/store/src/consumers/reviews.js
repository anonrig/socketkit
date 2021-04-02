import _ from 'lodash'
import * as Reviews from '../models/reviews.js'

export async function findAll(ctx) {
  const {
    application_id,
    country_id,
    version,
    cursor,
  } = ctx.req
  const rows = await Reviews.findAll(
    { application_id, country_id, version },
    { cursor },
  )

  const latest = _.last(rows)

  ctx.res = {
    rows,
    cursor: latest ? _.pick(latest, ['review_id']) : null
  }
}
