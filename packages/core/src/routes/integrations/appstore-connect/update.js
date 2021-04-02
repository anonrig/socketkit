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
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], body }) => {
    const { state } = await grpc.integrations.validate({
      access_token: body.requirement_payload.access_token.trim(),
    })

    if (!state) {
      throw f.httpErrors.preconditionFailed(
        `Token validation failed. Please, make sure you've entered the correct token.`,
      )
    }

    try {
      await grpc.integrations.update({
        account_id: account.account_id,
        provider_id: 'apple',
        access_token: body.requirement_payload.access_token,
      })
    } catch (error) {
      if (error.message?.includes('not found')) {
        await grpc.integrations.create({
          account_id: account.account_id,
          provider_id: 'apple',
          access_token: body.requirement_payload.access_token,
        })
      }
    }

    return { state: true }
  },
}
