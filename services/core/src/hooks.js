import { RequiredError } from '@ory/kratos-client/dist/base.js'

import { kratos } from './authentication/kratos.js'

import logger from './logger.js'
import { findOrCreate } from './models/accounts.js'

export const verify = async (request, reply) => {
  try {
    const { data } = await kratos.toSession(null, request.headers.cookie)
    request.user = data
    request.accounts = await findOrCreate({ identity_id: data.identity.id })
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
