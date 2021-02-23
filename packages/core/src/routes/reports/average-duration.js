import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/average-duration',
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
                primary: { type: 'string' },
                average_trial_duration: { type: 'number' },
                average_subscription_duration: { type: 'number' },
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

    return f.grpc.reports.averageDuration({
      account_id: account.account_id,
      start_date: query.from,
      end_date: query.to,
      application_id: query.application_id,
    })
  },
}
