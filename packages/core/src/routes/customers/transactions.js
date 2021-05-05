import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:subscriber_id/transactions',
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            subscriber_id: { type: 'string' },
            transaction_type: { type: 'string' },
            event_date: { type: 'string' },
            base_subscriber_purchase: { type: 'string' },
            base_developer_proceeds: { type: 'string' },
            subscription_package_id: { type: 'string' },
            subscription_package_name: { type: 'string' },
            application_id: { type: 'string' },
            country_id: { type: 'string' },
          },
          required: [
            'subscriber_id',
            'transaction_type',
            'event_date',
            'base_subscriber_purchase',
            'base_developer_proceeds',
            'subscription_package_id',
            'subscription_package_name',
            'application_id',
            'country_id',
          ],
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { subscriber_id } }) => {
    const { rows } = await grpc.subscribers.findTransactions({
      account_id: account.account_id,
      subscriber_id,
    })

    return rows
  },
}
