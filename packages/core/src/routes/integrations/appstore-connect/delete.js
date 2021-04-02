import { verify } from '../../../hooks.js'
import grpc from '../../../grpc.js'

export default {
  method: 'DELETE',
  path: '/',
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
  handler: async ({ accounts: [account] }) => {
    await grpc.integrations.destroy({
      account_id: account.account_id,
      provider_id: 'apple',
    })

    return { state: true }
  },
}
