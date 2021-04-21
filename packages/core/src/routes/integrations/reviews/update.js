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
          type: 'array',
          items: {
            type: 'object',
            properties: {
              application_id: { type: 'string' },
              country_ids: { type: 'array', items: { type: 'string' } },
            },
            required: ['application_id', 'country_ids'],
          },
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
  handler: async ({ accounts: [{ account_id }], body }) => {
    await grpc.storeIntegrations.upsertAll({
      account_id,
      applications: body.requirement_payload,
    })

    return { state: true }
  },
}
