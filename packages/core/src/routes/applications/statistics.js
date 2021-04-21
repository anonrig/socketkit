import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

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
              total_trial: { type: 'number' },
              at_start: { type: 'number' },
              at_start_trial: { type: 'number' },
              current: { type: 'number' },
              current_trial: { type: 'number' },
            },
            required: [
              'total',
              'total_trial',
              'at_start',
              'at_start_trial',
              'current',
              'current_trial',
            ],
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
    const [subscription_counts, transaction_sums] = await Promise.all([
      grpc.subscriptions.count({
        account_id: account.account_id,
        application_id,
      }),
      grpc.transactions.sum({
        account_id: account.account_id,
        application_id,
      }),
    ])

    return { subscription_counts, transaction_sums }
  },
}
