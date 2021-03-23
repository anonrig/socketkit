import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'PUT',
  path: '/:integration_id',
  schema: {
    body: {
      type: 'object',
      properties: {
        requirement_payload: {
          type: 'object',
          additionalProperties: true,
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
  handler: async ({
    accounts: [account],
    body,
    params: { integration_id },
  }) => {
    if (integration_id !== 'appstore-connect') {
      throw f.httpErrors.notFound()
    }

    const { state } = await f.grpc.integrations.validate({
      access_token: body.requirement_payload.access_token,
    })

    if (!state) {
      throw f.httpErrors.preconditionFailed(
        `Token validation failed. Please, make sure you've entered the correct token.`,
      )
    }

    try {
      await f.grpc.integrations.update({
        account_id: account.account_id,
        provider_id: 'apple',
        access_token: body.requirement_payload.access_token,
      })
    } catch (error) {
      if (error.message?.includes('not found')) {
        await f.grpc.integrations.create({
          account_id: account.account_id,
          provider_id: 'apple',
          access_token: body.requirement_payload.access_token,
        })
      }
    }

    return { state: true }
  },
}
