import grpc from '../../../grpc.js'
import { verify } from '../../../hooks.js'

export default {
  handler: async ({ accounts: [account] }) => {
    const { rows } = await grpc.storeIntegrations.findAll({
      account_id: account.account_id,
    })

    return rows
  },
  method: 'GET',
  path: '/',
  preHandler: verify,
  schema: {
    response: {
      200: {
        items: {
          properties: {
            application_icon: { type: 'string' },
            application_id: { type: 'string' },
            application_title: { type: 'string' },
            country_ids: { items: { type: 'string' }, type: 'array' },
          },
          required: ['application_id', 'application_title', 'application_icon', 'country_ids'],
          type: 'object',
        },
        type: 'array',
      },
    },
  },
}
