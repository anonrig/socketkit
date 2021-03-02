import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/mrr',
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
                month: { type: 'string' },
                mrr: { type: 'string' },
                clients: { type: 'number' },
                new_mrr: { type: 'string' },
                expansion_mrr: { type: 'string' },
                churned_mrr: { type: 'string' },
                contraction_mrr: { type: 'string' },
                net_new_mrr: { type: 'string' },
                mrr_churn: { type: 'string' },
                clients_churn: { type: 'number' },
                arpu: { type: 'string' },
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

    return f.grpc.reports.mrr({
      account_id: account.account_id,
      start_date: query.start_date,
      end_date: query.end_date,
      interval: `1 ${query.interval}`,
    })
  },
}
