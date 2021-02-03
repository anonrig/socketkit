import { verify } from '../../hooks.js'
import f from '../../server.js'

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
            application_id: { type: 'string' },
            application_name: { type: 'string' },
            transaction_type: { type: 'string' },
            subscription_package_id: { type: 'string' },
            subscription_package_name: { type: 'string' },
            transaction_event_date: { type: 'string' },
            transaction_base_client_purchase: { type: 'string' },
            transaction_base_developer_proceeds: { type: 'string' },
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

    const { transactions } = await f.grpc.clients.findTransactions({
      where: {
        account_id: account.account_id,
        client_id,
      },
    })

    return transactions
  },
}
