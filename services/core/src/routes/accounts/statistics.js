import dayjs from 'dayjs'

import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ accounts: [account], query }) => {
    const [subscription_counts, transaction_sums] = await Promise.all([
      grpc.subscriptions.count({
        account_id: account.account_id,
        end_date: query.end_date,
        start_date: query.start_date,
      }),
      grpc.transactions.sum({
        account_id: account.account_id,
        change_date: query.start_date,
        end_date: query.end_date,
        start_date: dayjs(query.start_date)
          .add(dayjs(query.start_date).diff(dayjs(query.end_date)))
          .format('YYYY-MM-DD'),
      }),
    ])

    return { subscription_counts, transaction_sums }
  },
  method: 'GET',
  path: '/statistics',
  preHandler: verify,
  schema: {
    query: {
      properties: {
        end_date: {
          format: 'date',
          type: 'string',
        },
        start_date: {
          format: 'date',
          type: 'string',
        },
      },
      required: ['start_date', 'end_date'],
      type: 'object',
    },
    response: {
      200: {
        properties: {
          subscription_counts: {
            properties: {
              at_start: { type: 'number' },
              at_start_trial: { type: 'number' },
              current: { type: 'number' },
              current_trial: { type: 'number' },
              total: { type: 'number' },
              total_trial: { type: 'number' },
            },
            required: [
              'total',
              'total_trial',
              'at_start',
              'at_start_trial',
              'current',
              'current_trial',
            ],
            type: 'object',
          },
          transaction_sums: {
            properties: {
              changed_refund_base_developer_proceeds: { type: 'string' },
              changed_total_base_developer_proceeds: { type: 'string' },
              current_refund_base_developer_proceeds: { type: 'string' },
              current_total_base_developer_proceeds: { type: 'string' },
            },
            required: [
              'changed_total_base_developer_proceeds',
              'changed_refund_base_developer_proceeds',
              'current_total_base_developer_proceeds',
              'current_refund_base_developer_proceeds',
            ],
            type: 'object',
          },
        },
        required: ['subscription_counts', 'transaction_sums'],
        type: 'object',
      },
    },
  },
}
