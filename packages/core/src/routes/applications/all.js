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
      },
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
                application_id: { type: 'string' },
                application_name: { type: 'string' },
                subscription_package_count: { type: 'string' },
                integration_id: { type: 'string' },
                provider_id: { type: 'string' },
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

    return f.grpc.applications.findAll({
      where: { account_id: account.account_id },
      opts: {
        limit: query.limit,
      },
    })
  },
}
