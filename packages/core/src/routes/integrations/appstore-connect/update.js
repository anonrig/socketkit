import { verify } from '../../../hooks.js'
import grpc from '../../../grpc.js'

export default {
  method: 'PUT',
  path: '/',
  schema: {
    body: {
      type: 'object',
      properties: {
        requirement_payload: {
          type: 'object',
          properties: {
            access_token: { type: 'string' },
          },
          required: ['access_token'],
        },
      },
      required: ['requirement_payload'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          state: { type: 'boolean' },
        },
        required: ['state'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], body }, reply) => {
    const { state } = await grpc.integrations.validate({
      access_token: body.requirement_payload.access_token.trim(),
    })

    if (!state) {
      return reply.preconditionFailed(
        `Token validation failed. Please, make sure you've entered a correct token and have valid sales on your AppStore account.`,
      )
    }

    await grpc.integrations.upsert({
      account_id: account.account_id,
      provider_id: 'apple',
      access_token: body.requirement_payload.access_token,
    })

    return { state: true }
  },
}
