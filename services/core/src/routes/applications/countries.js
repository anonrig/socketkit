import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

const region_names = new Intl.DisplayNames(['en'], { type: 'region' })

export default {
  method: 'GET',
  path: '/:application_id/countries',
  schema: {
    params: {
      type: 'object',
      properties: {
        application_id: { type: 'string' },
      },
      required: ['application_id'],
    },
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
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                country_id: { type: 'string' },
                country_name: { type: 'string' },
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
                'country_name',
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
  handler: async ({
    accounts: [account],
    params: { application_id },
    query,
  }) => {
    const { rows } = await grpc.subscriptions.groupByCountry({
      account_id: account.account_id,
      application_id,
      start_date: query.start_date,
      end_date: query.end_date,
    })

    return {
      rows: rows.map(({ country_id, ...rest }) => ({
        country_id,
        country_name: region_names.of(country_id.toUpperCase()),
        ...rest,
      })),
    }
  },
}