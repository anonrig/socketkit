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
          account_id: { type: 'string' },
          identity_id: { type: 'string' },
        },
        required: ['state'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ payments, accounts: [{ account_id }], user }) =>
    Object.assign({}, payments, { account_id, identity_id: user.identity.id }),
}
