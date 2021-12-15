import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

const region_names = new Intl.DisplayNames(['en'], { type: 'region' })

export default {
  handler: async ({ accounts: [account], query, params: { application_id } }) => {
    const { rows, cursor } = await grpc.subscribers.findAll({
      account_id: account.account_id,
      application_id,
      cursor: query.cursor,
      end_date: query.end_date,
      start_date: query.start_date,
    })

    return {
      cursor,
      rows: rows.map(({ country_id, ...rest }) => ({
        country_id,
        country_name: region_names.of(country_id.toUpperCase()),
        ...rest,
      })),
    }
  },
  method: 'GET',
  path: '/:application_id/customers',
  preHandler: verify,
  schema: {
    params: {
      properties: {
        application_id: { type: 'string' },
      },
      required: ['application_id'],
      type: 'object',
    },
    querystring: {
      properties: {
        cursor: {
          properties: {
            first_interaction: { type: 'string' },
            subscriber_id: { type: 'string' },
          },
          required: ['subscriber_id', 'first_interaction'],
          type: 'object',
        },
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
          cursor: {
            properties: {
              first_interaction: { type: 'string' },
              subscriber_id: { type: 'string' },
            },
            required: ['subscriber_id', 'first_interaction'],
            type: ['object', 'null'],
          },
          rows: {
            items: {
              properties: {
                country_id: { type: 'string' },
                country_name: { type: 'string' },
                device_type_id: { type: 'string' },
                device_type_name: { type: 'string' },
                first_interaction: { type: 'string' },
                provider_id: { type: 'string' },
                subscriber_id: { type: 'string' },
                total_base_developer_proceeds: { type: 'string' },
                total_base_subscriber_purchase: { type: 'string' },
              },
              required: [
                'subscriber_id',
                'first_interaction',
                'total_base_subscriber_purchase',
                'total_base_developer_proceeds',
                'country_id',
                'country_name',
                'device_type_id',
                'device_type_name',
                'provider_id',
              ],
              type: 'object',
            },
            type: 'array',
          },
        },
        required: ['cursor', 'rows'],
        type: 'object',
      },
    },
  },
}
