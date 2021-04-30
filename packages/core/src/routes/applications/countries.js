import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:application_id/countries',
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
        type: 'object',
        properties: {
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                country_id: { type: 'string' },
                total_count: { type: 'number' },
                total_direct_sale_count: { type: 'number' },
                total_trial_count: { type: 'number' },
                paid_converted_from_trial: { type: 'number' },
                revenue: { type: 'number' },
                churned_from_trial: { type: 'number' },
                churned_from_direct_sale: { type: 'number' },
              },
              required: [
                'country_id',
                'total_count',
                'total_direct_sale_count',
                'total_trial_count',
                'paid_converted_from_trial',
                'revenue',
                'churned_from_trial',
                'churned_from_direct_sale',
              ],
            },
          },
        },
        required: ['rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { application_id }, query }) =>
    grpc.subscriptions.groupByCountry({
      account_id: account.account_id,
      application_id,
      start_date: query.from,
      end_date: query.to,
    }),
}
