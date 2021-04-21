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
            client_id: { type: 'string' },
            first_interaction: { type: 'string' },
          },
          required: ['client_id', 'first_interaction'],
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
              client_id: { type: 'string' },
              first_interaction: { type: 'string' },
            },
          },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                client_id: { type: 'string' },
                first_interaction: { type: 'string' },
                total_base_client_purchase: { type: 'string' },
                total_base_developer_proceeds: { type: 'string' },
                country_id: { type: 'string' },
                device_type_id: { type: 'string' },
                device_type_name: { type: 'string' },
                provider_id: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({
    accounts: [account],
    query,
    params: { application_id },
  }) => {
    return grpc.clients.findAll({
      account_id: account.account_id,
      application_id,
      start_date: query.from,
      end_date: query.to,
      cursor: query.cursor,
    })
  },
}
