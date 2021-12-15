import grpc from '../../../grpc.js'
import { verify } from '../../../hooks.js'

export default {
  handler: async ({ accounts: [account] }) => {
    const { rows } = await grpc.integrations.findAll({
      account_id: account.account_id,
      provider_id: 'apple',
    })

    if (rows.length) {
      return rows[0]
    }

    return {
      access_token: null,
      failed_fetches: 0,
      last_fetch: null,
      state: 'inactive',
    }
  },
  method: 'GET',
  path: '/',
  preHandler: verify,
  schema: {
    response: {
      200: {
        properties: {
          access_token: { type: ['string', 'null'] },
          failed_fetches: { default: 0, type: 'number' },
          last_fetch: { default: null, type: ['string', 'null'] },
          state: { default: 'inactive', type: 'string' },
        },
        required: ['access_token', 'last_fetch', 'state', 'failed_fetches'],
        type: 'object',
      },
    },
  },
}
