import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/mrr',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          format: 'date',
        },
        to: {
          type: 'string',
          format: 'date',
        },
        application_id: {
          type: 'string',
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
      start_date: query.from,
      end_date: query.to,
      application_id: query.application_id,
    })
  },
}
