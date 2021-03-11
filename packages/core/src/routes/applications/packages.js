import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/:application_id/packages',
  schema: {
    query: {
      type: 'object',
      properties: {
        limit: { type: ['number', 'null'], default: 10, minimum: 10 },
      },
    },
  },
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          rows: {
            type: 'array',
            items: {
              subscription_name: { type: 'string' },
              subscription_package_id: { type: 'string' },
              subscription_duration: { type: 'string' },
              subscription_group_id: { type: 'string' },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { application_id } }) => {
    return f.grpc.subscriptions.findPackages({
      account_id: account.account_id,
      application_id,
    })
  },
}
