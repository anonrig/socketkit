import { Configuration, PublicApi, AdminApi } from '@ory/kratos-client'
import { RequiredError } from '@ory/kratos-client/dist/base.js'
import config from './config.js'
import { createAccount, getAccounts } from './models/accounts.js'
import logger from './logger.js'

export const kratos = new PublicApi(
  new Configuration({ basePath: config.kratos.public }),
)

export const kratos_private = new AdminApi(
  new Configuration({ basePath: config.kratos.private }),
)

export const verify = async (request, reply) => {
  const { cookie, authorization } = request.headers

  try {
    const { data } = await kratos.whoami(cookie, authorization)
    request.user = data
    request.integration = await Integrations.findOne({ account_id })

    if (!integration) {
      request.integration = await Integrations.create({
        account_id: request.
      })
    }
  } catch (error) {
    if (error instanceof RequiredError) {
      reply.forbidden()
    } else if (error.message.includes('401')) {
      reply.unauthorized()
    } else {
      logger.fatal(error)
      reply.internalServerError(error.message)
    }
  }
}
