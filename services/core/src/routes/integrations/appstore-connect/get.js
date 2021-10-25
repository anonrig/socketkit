import { verify } from '../../../hooks.js'
import grpc from '../../../grpc.js'

export default {
  method: 'GET',
  path: '/',
  preHandler: verify,
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          access_token: { type: ['string', 'null'] },
          failed_fetches: { type: 'number', default: 0 },
          last_fetch: { type: ['string', 'null'], default: null },
          state: { type: 'string', default: 'inactive' },
        },
        required: ['access_token', 'last_fetch', 'state', 'failed_fetches'],
      },
    },
  },
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
      last_fetch: null,
      state: 'inactive',
      failed_fetches: 0,
    }
  },
}
