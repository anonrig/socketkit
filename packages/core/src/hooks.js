import { Configuration, PublicApi, AdminApi } from '@ory/kratos-client'
import { RequiredError } from '@ory/kratos-client/dist/base.js'

import grpc from './grpc.js'
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
    request.accounts = await getAccounts({ identity_id: data.identity.id })

    if (request.accounts.length === 0) {
      const account = await createAccount({
        identity_id: request.user.identity.id,
      })
      request.accounts = [account]
    }

    request.payment_integration = await grpc.paymentIntegrations.findOrCreate({
      account_id: request.accounts[0].account_id,
      name: request.user.identity.traits.name,
      email: request.user.identity.traits.email,
    })
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
