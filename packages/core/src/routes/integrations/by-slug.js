import { verify } from '../../hooks.js'
import f from '../../server.js'
import { createAccount } from '../../methods/accounts.js'

export default {
  method: 'GET',
  path: '/:integration_id',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          slug: { type: 'string' },
          integration: {
            type: ['object', 'null'],
            properties: {
              last_fetch: { type: 'string' },
              state: { type: 'string' },
              access_token: { type: 'string' },
            },
          },
          requirement_schema: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              required: {
                type: 'array',
                items: { type: 'string', label: 'string' },
              },
              properties: { type: 'object', additionalProperties: true },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { integration_id } }) => {
    if (integration_id !== 'appstore-connect') {
      throw f.httpErrors.notFound()
    }

    const { row: integration } = await f.grpc.integrations.findOne({
      account_id: account.account_id,
      provider_id: 'apple',
    })

    return {
      slug: 'appstore-connect',
      title: 'AppStore Connect',
      description: 'Transactions and Sales support for Apple',
      requirement_schema: {
        type: 'object',
        required: ['access_token'],
        properties: {
          access_token: { type: 'string', label: 'Access Token' },
        },
      },
      integration,
    }
  },
}
