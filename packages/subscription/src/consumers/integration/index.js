import onValidate from './on-validate.js'
import onCreate from './on-create.js'
import onProcessDate from './on-process-date.js'
import getLatestLog from './get-latest-log.js'
import pg from '../../pg.js'

export const findLatestScrape = async (ctx) => {
  const { account_id } = ctx.req
  ctx.res = {
    row: await getLatestLog({ account_id }),
  }
}

export const validate = async (ctx) => {
  const { access_token } = ctx.req
  ctx.res = {
    state: await onValidate(access_token),
  }
}

export const create = async (ctx) => {
  const { account_id, access_token } = ctx.req
  ctx.res = await onCreate({ account_id, access_token })
}

export const processDate = async (ctx) => {
  const { date, account_id, access_token } = ctx.req
  ctx.res = await pg.transaction(async (trx) =>
    onProcessDate({ date, account_id, access_token }, trx),
  )
}
