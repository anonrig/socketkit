import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/countries',
  schema: {
    query: {
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
        type: 'array',
        items: {
          type: 'object',
          properties: {
            country_id: { type: 'string' },
            total_count: { type: 'number' },
            trial_past_count: { type: 'number' },
            churn_count: { type: 'number' },
            revenue: { type: 'number' },
          },
          required: [
            'country_id',
            'total_count',
            'trial_past_count',
            'churn_count',
            'revenue',
          ],
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], query }) => {
    const { rows } = await grpc.subscriptions.groupByCountry({
      account_id: account.account_id,
      start_date: query.from,
      end_date: query.to,
    })

    return rows
  },
}
