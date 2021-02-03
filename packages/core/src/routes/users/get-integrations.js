import { verify } from '../../hooks.js'

export default {
  method: 'GET',
  path: '/me/integrations',
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            account_id: { type: 'string' },
            integration_id: { type: 'string' },
            requirement_payload: {
              type: 'object',
              properties: { access_token: { type: 'string' } },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ integrations }) => integrations,
}
