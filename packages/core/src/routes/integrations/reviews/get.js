import { verify } from '../../../hooks.js'
import grpc from '../../../grpc.js'

export default {
  method: 'GET',
  path: '/',
  preHandler: verify,
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            application_id: { type: 'string' },
            application_title: { type: 'string' },
            application_icon: { type: 'string' },
            country_ids: { type: 'array', items: { type: 'string' } },
          },
          required: ['application_id', 'application_title', 'application_icon', 'country_ids'],
        },
      },
    },
  },
  handler: async ({ accounts: [account] }) => {
    const { rows } = await grpc.applications.findIntegrations({
      account_id: account.account_id,
    })

    return rows
  },
}
