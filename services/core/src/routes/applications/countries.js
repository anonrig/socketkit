import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

const region_names = new Intl.DisplayNames(['en'], { type: 'region' })

export default {
  handler: async ({ accounts: [account], params: { application_id }, query }) => {
    const { rows } = await grpc.subscriptions.groupByCountry({
      account_id: account.account_id,
      application_id,
      end_date: query.end_date,
      start_date: query.start_date,
    })

    return {
      rows: rows.map(({ country_id, ...rest }) => ({
        country_id,
        country_name: region_names.of(country_id.toUpperCase()),
        ...rest,
      })),
    }
  },
  method: 'GET',
  path: '/:application_id/countries',
  preHandler: verify,
  schema: {
    params: {
      properties: {
        application_id: { type: 'string' },
      },
      required: ['application_id'],
      type: 'object',
    },
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
          rows: {
            items: {
              properties: {
                churned_from_direct_sale: { type: 'number' },
                churned_from_trial: { type: 'number' },
                country_id: { type: 'string' },
                country_name: { type: 'string' },
                paid_converted_from_trial: { type: 'number' },
                revenue: { type: 'number' },
                total_count: { type: 'number' },
                total_direct_sale_count: { type: 'number' },
                total_trial_count: { type: 'number' },
              },
              required: [
                'country_id',
                'country_name',
                'total_count',
                'total_direct_sale_count',
                'total_trial_count',
                'paid_converted_from_trial',
                'revenue',
                'churned_from_trial',
                'churned_from_direct_sale',
              ],
              type: 'object',
            },
            type: 'array',
          },
        },
        required: ['rows'],
        type: 'object',
      },
    },
  },
}
