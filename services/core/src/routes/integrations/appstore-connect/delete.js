import grpc from '../../../grpc.js'
import { verify } from '../../../hooks.js'

export default {
  handler: async ({ accounts: [account] }) => {
    await grpc.integrations.destroy({
      account_id: account.account_id,
      provider_id: 'apple',
    })

    return { state: true }
  },
  method: 'DELETE',
  path: '/',
  preHandler: verify,
  schema: {
    response: {
      200: {
        properties: {
          state: { type: 'boolean' },
        },
        required: ['state'],
        type: 'object',
      },
    },
  },
}
