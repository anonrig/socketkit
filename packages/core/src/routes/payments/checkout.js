import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/checkout',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          session_id: { type: 'string' },
        },
        required: ['session_id'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [{ account_id }] }) => {
    const session = await grpc.payments.createSession({
      account_id,
      session_type: 'checkout',
    })

    return { session_id: session.id }
  },
}
