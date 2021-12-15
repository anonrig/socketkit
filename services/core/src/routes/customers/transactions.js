import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ accounts: [account], params: { subscriber_id } }) => {
    const { rows } = await grpc.subscribers.findTransactions({
      account_id: account.account_id,
      subscriber_id,
    })

    return rows
  },
  method: 'GET',
  path: '/:subscriber_id/transactions',
  preHandler: verify,
  schema: {
    response: {
      200: {
        items: {
          properties: {
            application_id: { type: 'string' },
            base_developer_proceeds: { type: 'string' },
            base_subscriber_purchase: { type: 'string' },
            country_id: { type: 'string' },
            event_date: { type: 'string' },
            subscriber_id: { type: 'string' },
            subscription_package_id: { type: 'string' },
            subscription_package_name: { type: 'string' },
            transaction_type: { type: 'string' },
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
          type: 'object',
        },
        type: 'array',
      },
    },
  },
}
