import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/:application_id/statistics',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          subscription_counts: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              trial: { type: 'number' },
              current: { type: 'number' },
            },
            required: ['total', 'trial', 'current'],
          },
          transaction_sums: {
            type: 'object',
            properties: {
              current_total_base_developer_proceeds: { type: 'string' },
              current_refund_base_developer_proceeds: { type: 'string' },
            },
            required: [
              'current_total_base_developer_proceeds',
              'current_refund_base_developer_proceeds',
            ],
          },
        },
        required: ['subscription_counts', 'transaction_sums'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { application_id } }) => {
    if (!account) {
      throw f.httpErrors.notFound(`Account not found`)
    }

    const [subscription_counts, transaction_sums] = await Promise.all([
      f.grpc.subscriptions.count({
        account_id: account.account_id,
        application_id,
      }),
      f.grpc.transactions.sum({
        account_id: account.account_id,
        application_id,
      }),
    ])

    return { subscription_counts, transaction_sums }
  },
}
