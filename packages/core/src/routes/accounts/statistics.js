import dayjs from 'dayjs'
import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/statistics',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          format: 'date',
        },
        to: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['from', 'to'],
    },
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
          },
          transaction_sums: {
            type: 'object',
            properties: {
              changed_total_base_developer_proceeds: { type: 'string' },
              changed_refund_base_developer_proceeds: { type: 'string' },
              current_total_base_developer_proceeds: { type: 'string' },
              current_refund_base_developer_proceeds: { type: 'string' },
            },
            required: [
              'changed_total_base_developer_proceeds',
              'changed_refund_base_developer_proceeds',
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
  handler: async ({ accounts: [account], query }) => {
    const [subscription_counts, transaction_sums] = await Promise.all([
      f.grpc.subscriptions.count({
        account_id: account.account_id,
        start_date: query.from,
        end_date: query.to,
      }),
      f.grpc.transactions.sum({
        account_id: account.account_id,
        start_date: dayjs(query.from)
          .add(dayjs(query.from).diff(dayjs(query.to)))
          .format('YYYY-MM-DD'),
        change_date: query.from,
        end_date: query.to,
      }),
    ])

    return { subscription_counts, transaction_sums }
  },
}
