import { RequiredError } from '@ory/kratos-client/dist/base.js'
import { kratos } from './authentication/kratos.js'

import grpc from './grpc.js'
import { findOrCreate } from './models/accounts.js'
import logger from './logger.js'

export const verify = async (request, reply) => {
  try {
    const { data } = await kratos.toSession(null, request.headers.cookie)
    request.user = data
    request.accounts = await findOrCreate({ identity_id: data.identity.id })

    try {
      request.payments = await grpc.paymentIntegrations.findOrCreate({
        account_id: request.accounts[0].account_id,
        name: request.user.identity.traits.name,
        email: request.user.identity.traits.email,
      })
    } catch (error) {
      if (!error.message.includes('UNAVAILABLE')) {
        logger.warn(error.message)
        logger.info({
          account_id: request.accounts[0].account_id,
          name: request.user.identity.traits.name,
          email: request.user.identity.traits.email,
        })
      }
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
