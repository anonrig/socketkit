import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        limit: { type: ['number', 'null'], default: 10, minimum: 10 },
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
          count: { type: 'number' },
          cursor: {
            type: 'object',
            properties: {
              client_id: { type: 'string' },
              first_interaction: { type: 'string' },
            },
            required: ['client_id', 'first_interaction'],
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
                country_name: { type: 'string' },
                device_type_id: { type: 'string' },
                device_type_name: { type: 'string' },
                provider_id: { type: 'string' },
                provider_name: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], query }) => {
    if (!account) {
      return []
    }

    return f.grpc.clients.findAll({
      where: { account_id: account.account_id },
      opts: {
        limit: query.limit,
        filter: {
          from: query.from,
          to: query.to,
        },
      },
      cursor: query.cursor,
    })
  },
}
