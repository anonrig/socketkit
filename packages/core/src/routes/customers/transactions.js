import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:client_id/transactions',
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            client_id: { type: 'string' },
            transaction_type: { type: 'string' },
            event_date: { type: 'string' },
            base_client_purchase: { type: 'string' },
            base_developer_proceeds: { type: 'string' },
            subscription_package_id: { type: 'string' },
            subscription_package_name: { type: 'string' },
            application_id: { type: 'string' },
            application_name: { type: 'string' },
            country_id: { type: 'string' },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { client_id } }) => {
    const { rows } = await grpc.clients.findTransactions({
      account_id: account.account_id,
      client_id,
    })

    return rows
  },
}
