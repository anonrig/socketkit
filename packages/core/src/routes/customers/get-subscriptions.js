import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/:client_id/subscriptions',
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            subscription_active_period: {
              type: 'array',
              items: { type: 'string' },
            },
            subscription_package_id: { type: 'string' },
            subscription_package_name: { type: 'string' },
            application_id: { type: 'string' },
            application_name: { type: 'string' },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { client_id } }) => {
    if (!account) {
      throw f.httpErrors.notFound(`Account not found`)
    }

    const { subscriptions } = await f.grpc.clients.findSubscriptions({
      where: {
        account_id: account.account_id,
        client_id,
      },
    })

    return subscriptions
  },
}
