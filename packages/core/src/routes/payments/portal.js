import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/portal',
  preHandler: verify,
  handler: async (
    { accounts: [{ account_id }], user: { identity } },
    response,
  ) => {
    const session = await grpc.payments.createSession({
      account_id,
      session_type: 'portal',
      email: identity.traits.email,
    })

    response.redirect(session.url)
  },
}
