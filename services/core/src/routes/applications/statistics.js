import dayjs from 'dayjs'

import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ accounts: [{ account_id }], params: { application_id } }) => {
    const {
      rows: [integration],
    } = await grpc.integrations.findAll({
      account_id,
      provider_id: 'apple',
    })

    const subscriptions = { account_id, application_id }
    const transactions = {
      account_id,
      application_id,
      end_date: dayjs().format('YYYY-MM-DD'),
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    }

    if (integration?.last_fetch) {
      subscriptions.start_date = integration.last_fetch
      transactions.start_date = dayjs(integration.last_fetch)
        .subtract('1', 'month')
        .format('YYYY-MM-DD')
      transactions.end_date = integration.last_fetch
    }

    const [subscription_counts, transaction_sums] = await Promise.all([
      grpc.subscriptions.count(subscriptions),
      grpc.transactions.sum(transactions),
    ])

    return { subscription_counts, transaction_sums }
  },
  method: 'GET',
  path: '/:application_id/statistics',
  preHandler: verify,
  schema: {
    params: {
      properties: {
        application_id: { type: 'string' },
      },
      required: ['application_id'],
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
              current_refund_base_developer_proceeds: { type: 'string' },
              current_total_base_developer_proceeds: { type: 'string' },
            },
            required: [
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
