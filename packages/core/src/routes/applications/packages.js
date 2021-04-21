import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:application_id/packages',
  schema: {
    query: {
      type: 'object',
      properties: {
        limit: { type: 'number', default: 10, minimum: 10 },
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
              type: 'object',
              properties: {
                subscription_name: { type: 'string' },
                subscription_package_id: { type: 'string' },
                subscription_duration: { type: 'string' },
                subscription_group_id: { type: 'string' },
              },
              required: [
                'subscription_name',
                'subscription_package_id',
                'subscription_duration',
                'subscription_group_id',
              ],
            },
          },
        },
        required: ['rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { application_id } }) => {
    return grpc.subscriptions.findPackages({
      account_id: account.account_id,
      application_id,
    })
  },
}
