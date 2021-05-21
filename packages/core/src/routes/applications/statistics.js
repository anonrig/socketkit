import dayjs from 'dayjs'
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
  handler: async ({
    accounts: [{ account_id }],
    params: { application_id },
  }) => {
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
      start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
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
}
