import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/portal',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [{ account_id }], user }, response) => {
    const session = await grpc.payments.createSession({
      account_id,
      session_type: 'portal',
      email: user.identity.traits.email,
    })

    response.redirect(session.url)
  },
}
