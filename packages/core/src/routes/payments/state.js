import { verify } from '../../hooks.js'

export default {
  method: 'GET',
  path: '/state',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          state: {
            type: 'string',
            values: [
              'incomplete',
              'incomplete_expired',
              'trialing',
              'active',
              'past_due',
              'canceled',
              'unpaid',
              'new',
            ],
          },
        },
        required: ['state'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ payments }) => payments,
}
