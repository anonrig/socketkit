import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'DELETE',
  path: '/:integration_id',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          state: { type: 'boolean' },
        },
      },
    },
  },
  preHandler: verify,
  handler: async (
    { accounts: [account], params: { integration_id } },
    reply,
  ) => {
    if (integration_id !== 'appstore-connect') {
      return reply.notFound()
    }

    await grpc.integrations.destroy({
      account_id: account.account_id,
      provider_id: 'apple',
    })

    return { state: true }
  },
}
