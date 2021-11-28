import grpc from '@grpc/grpc-js'
import dayjs from 'dayjs'
import _ from 'lodash'
import { validate } from 'uuid'

import * as Reviews from '../models/reviews.js'

export async function findAll(ctx) {
  const { application_ids, country_ids, version_ids, cursor, start_date, end_date } = ctx.req
  const rows = await Reviews.findAll(
    { application_ids, country_ids, version_ids },
    { cursor, end_date, start_date },
  )

  const latest = _.last(rows)

  ctx.res = {
    cursor: latest
      ? {
          review_id: latest.review_id,
          updated_at: dayjs(latest.updated_at).format('YYYY-MM-DD'),
        }
      : null,
    rows,
  }
}

export async function findVersions(ctx) {
  const { application_id } = ctx.req

  if (!application_id) {
    const error = new Error(`Missing application id`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = {
    rows: await Reviews.findVersions({ application_id }),
  }
}

export async function findCountries(ctx) {
  const { account_id, application_id } = ctx.req

  if (!validate(account_id)) {
    const error = new Error(`Invalid account id`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = {
    rows: await Reviews.findCountries({ account_id, application_id }),
  }
}
