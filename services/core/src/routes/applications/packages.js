import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ accounts: [account], params: { application_id } }) =>
    grpc.subscriptions.findPackages({
      account_id: account.account_id,
      application_id,
    }),
  method: 'GET',
  path: '/:application_id/packages',
  preHandler: verify,
  schema: {
    params: {
      properties: {
        application_id: { type: 'string' },
      },
      required: ['application_id'],
      type: 'object',
    },
    query: {
      properties: {
        limit: { default: 10, minimum: 10, type: 'number' },
      },
      required: [],
      type: 'object',
    },
    response: {
      200: {
        properties: {
          rows: {
            items: {
              properties: {
                subscription_duration: { type: 'string' },
                subscription_group_id: { type: 'string' },
                subscription_name: { type: 'string' },
                subscription_package_id: { type: 'string' },
              },
              required: [
                'subscription_name',
                'subscription_package_id',
                'subscription_duration',
                'subscription_group_id',
              ],
              type: 'object',
            },
            type: 'array',
          },
        },
        required: ['rows'],
        type: 'object',
      },
    },
  },
}
