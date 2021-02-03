import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/countries',
  schema: {
    query: {
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
      },
      required: ['from', 'to'],
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            country_id: { type: 'string' },
            country_name: { type: 'string' },
            country_coordinates: {
              type: 'object',
              properties: { x: { type: 'number' }, y: { type: 'number' } },
              required: ['x', 'y'],
            },
            total_count: { type: 'number' },
            trial_past_count: { type: 'number' },
            churn_count: { type: 'number' },
            revenue: { type: 'number' },
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

    const { values } = await f.grpc.accounts.findCountries({
      where: { account_id: account.account_id },
      opts: {
        filter: {
          from: query.from,
          to: query.to,
        },
      },
    })

    return values
  },
}
