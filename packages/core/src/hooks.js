import { Configuration, PublicApi } from '@ory/kratos-client'
import { createAccount, getAccounts } from './models/accounts.js'
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

    if (request.accounts.length === 0) {
      const account = await createAccount({
        identity_id: request.user.identity.id,
      })
      request.accounts = [account]
    }
  } catch (error) {
    if (error instanceof RequiredError) {
      throw f.httpErrors.forbidden()
    } else if (error.message.includes('401')) {
      throw f.httpErrors.unauthorized()
    } else {
      logger.fatal(error)
      throw f.httpErrors.internalServerError()
    }
  }
}
