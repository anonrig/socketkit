import grpc from '../../../grpc.js'
import { verify } from '../../../hooks.js'

export default {
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
      access_token: body.requirement_payload.access_token,
      account_id: account.account_id,
      provider_id: 'apple',
    })

    return { state: true }
  },
  method: 'PUT',
  path: '/',
  preHandler: verify,
  schema: {
    body: {
      properties: {
        requirement_payload: {
          properties: {
            access_token: { type: 'string' },
          },
          required: ['access_token'],
          type: 'object',
        },
      },
      required: ['requirement_payload'],
      type: 'object',
    },
    response: {
      200: {
        properties: {
          state: { type: 'boolean' },
        },
        required: ['state'],
        type: 'object',
      },
    },
  },
}
