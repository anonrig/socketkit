import dayjs from 'dayjs'
import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/statistics',
  schema: {
    query: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          format: 'date',
        },
        end_date: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['start_date', 'end_date'],
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
      grpc.subscriptions.count({
        account_id: account.account_id,
        start_date: query.start_date,
        end_date: query.end_date,
      }),
      grpc.transactions.sum({
        account_id: account.account_id,
        start_date: dayjs(query.start_date)
          .add(dayjs(query.start_date).diff(dayjs(query.end_date)))
          .format('YYYY-MM-DD'),
        change_date: query.start_date,
        end_date: query.end_date,
      }),
    ])

    return { subscription_counts, transaction_sums }
  },
}
