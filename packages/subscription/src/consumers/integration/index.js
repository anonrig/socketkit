import onValidate from './on-validate.js'
import onCreate from './on-create.js'
import onProcessDate from './on-process-date.js'
import getLatestLog from './get-latest-log.js'
import pg from '../../pg.js'

export const findLatestScrape = async (
  { request: { account_id } },
  callback,
) => {
  try {
    callback(null, await getLatestLog({ account_id }))
  } catch (error) {
    callback(error)
  }
}

export const validate = async ({ request: { access_token } }, callback) => {
  callback(null, {
    state: await onValidate(access_token),
  })
}

export const create = async (
  { request: { account_id, access_token } },
  callback,
) => {
  try {
    callback(null, await onCreate({ account_id, access_token }))
  } catch (error) {
    callback(error)
  }
}

export const processDate = async ({ request }, callback) => {
  try {
    callback(
      null,
      await pg.transaction(async (trx) => onProcessDate(request, trx)),
    )
  } catch (error) {
    callback(error)
  }
}
