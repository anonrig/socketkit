import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/subscription/:report_id',
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
          // enum: ['week', 'month', 'year'],
        },
      },
      required: ['start_date', 'end_date', 'interval'],
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
                x: { type: 'string' },
                y0: { type: 'number' },
                y1: { type: 'number' },
                y2: { type: 'number' },
                y3: { type: 'number' },
                y4: { type: 'number' },
                y5: { type: 'number' },
                y6: { type: 'number' },
                y7: { type: 'number' },
                y8: { type: 'number' },
                y9: { type: 'number' },
              },
              required: ['x', 'y0'],
            },
          },
        },
        required: ['rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], query, params }) => {
    const { rows } = await grpc.reports.get({
      report_id: params.report_id,
      account_id: account.account_id,
      start_date: query.start_date,
      end_date: query.end_date,
      interval: `1 ${query.interval}`,
    })

    return {
      rows,
    }
  },
}
