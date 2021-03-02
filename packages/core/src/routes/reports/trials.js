import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/trials',
  schema: {
    querystring: {
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
        interval: {
          type: 'string',
          default: 'week',
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          available_filters: {
            type: 'array',
            items: { type: 'string' },
          },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                primary: { type: 'string' },
                secondary: { type: 'number' },
                previous_secondary: { type: 'number' },
              },
            },
          },
          secondary_field: { type: 'string' },
          fields: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], query }) => {
    if (!account) {
      throw f.httpErrors.notFound(`Account not found`)
    }

    return f.grpc.reports.trials({
      account_id: account.account_id,
      start_date: query.start_date,
      end_date: query.end_date,
      interval: `1 ${query.interval}`,
    })
  },
}
