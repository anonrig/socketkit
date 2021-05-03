import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/state',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          subscription_state: {
            type: 'string',
            values: ['inactive', 'active', 'incomplete'],
          },
        },
        required: ['subscription_state'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ payment_integration }) => payment_integration,
}
