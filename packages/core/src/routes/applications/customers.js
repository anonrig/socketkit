import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

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
    return grpc.subscribers.findAll({
      account_id: account.account_id,
      application_id,
      start_date: query.from,
      end_date: query.to,
      cursor: query.cursor,
    })
  },
}
