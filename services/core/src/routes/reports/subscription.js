import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ accounts: [{ account_id }], query, params }) => {
    const { rows } = await grpc.reports.get({
      account_id,
      application_id: query.application_id,
      end_date: query.end_date,
      interval: `1 ${query.interval}`,
      report_id: params.report_id,
      start_date: query.start_date,
    })

    return {
      rows,
    }
  },
  method: 'GET',
  path: '/subscription/:report_id',
  preHandler: verify,
  schema: {
    query: {
      properties: {
        application_id: {
          type: 'string',
        },
        end_date: {
          format: 'date',
          type: 'string',
        },
        interval: {
          enum: ['day', 'week', 'month'],
          type: 'string',
        },
        start_date: {
          format: 'date',
          type: 'string',
        },
      },
      required: ['start_date', 'end_date', 'interval'],
      type: 'object',
    },
    response: {
      200: {
        properties: {
          rows: {
            items: {
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
