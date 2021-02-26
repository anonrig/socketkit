import { Configuration, PublicApi } from '@ory/kratos-client'
import { getAccounts } from './methods/accounts.js'
import logger from './logger.js'
import f from './server.js'
import { RequiredError } from '@ory/kratos-client/dist/base.js'

const kratos = new PublicApi(
  new Configuration({ basePath: 'https://login.socketkit.com' }),
)

export const verify = async (request) => {
  const { cookie, authorization } = request.headers

  try {
    const { data } = await kratos.whoami(cookie, authorization)
    request.user = data
    request.accounts = await getAccounts({ identity_id: data.identity.id })
  } catch (error) {
    if (error instanceof RequiredError) {
      throw f.httpErrors.forbidden()
    } else {
      logger.fatal(error)
      throw f.httpErrors.internalServerError()
    }
  }
}
