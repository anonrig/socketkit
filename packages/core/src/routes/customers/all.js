import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/',
  schema: {
    query: {
      type: 'object',
      properties: {
        limit: { type: ['number', 'null'], default: 10, minimum: 10 },
        page: {
          type: ['number', 'null'],
          default: 1,
          minimum: 1,
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
          pages: { type: 'number' },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                client_id: { type: 'string' },
                client_first_interaction: { type: 'string' },
                client_total_base_client_purchase: { type: 'string' },
                client_total_base_developer_proceeds: { type: 'string' },
                country_id: { type: 'string' },
                country_name: { type: 'string' },
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
        page: query.page,
        filter: {
          from: query.from,
          to: query.to,
        },
      },
    })
  },
}
