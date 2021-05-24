import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

const region_names = new Intl.DisplayNames(['en'], { type: 'region' })

export default {
  method: 'GET',
  path: '/:application_id/customers',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        cursor: {
          type: 'object',
          properties: {
            subscriber_id: { type: 'string' },
            first_interaction: { type: 'string' },
          },
          required: ['subscriber_id', 'first_interaction'],
        },
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
          cursor: {
            type: ['object', 'null'],
            properties: {
              subscriber_id: { type: 'string' },
              first_interaction: { type: 'string' },
            },
            required: ['subscriber_id', 'first_interaction'],
          },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                subscriber_id: { type: 'string' },
                first_interaction: { type: 'string' },
                total_base_subscriber_purchase: { type: 'string' },
                total_base_developer_proceeds: { type: 'string' },
                country_id: { type: 'string' },
                country_name: { type: 'string' },
                device_type_id: { type: 'string' },
                device_type_name: { type: 'string' },
                provider_id: { type: 'string' },
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
            },
          },
        },
        required: ['cursor', 'rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({
    accounts: [account],
    query,
    params: { application_id },
  }) => {
    const { rows, cursor } = await grpc.subscribers.findAll({
      account_id: account.account_id,
      application_id,
      start_date: query.start_date,
      end_date: query.end_date,
      cursor: query.cursor,
    })

    return {
      rows: rows.map(({ country_id, ...rest }) => ({
        country_id,
        country_name: region_names.of(country_id.toUpperCase()),
        ...rest,
      })),
      cursor,
    }
  },
}
