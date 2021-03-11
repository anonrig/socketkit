import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/',
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            rows: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  slug: { type: 'string' },
                  integration: {
                    type: 'object',
                    properties: {
                      last_fetch: { type: 'string' },
                      state: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], user: { identity } }) => {
    const appstore = await f.grpc.integrations.findAll({
      account_id: account.account_id,
      provider_id: 'apple',
    })

    return [
      {
        category: 'Data Sources',
        rows: [
          {
            slug: 'appstore-connect',
            title: 'AppStore Connect',
            description: 'Transactions and Sales support for Apple',
            integration: appstore.rows[0],
          },
        ],
      },
    ]
  },
}
