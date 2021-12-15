import grpc from '../../../grpc.js'
import { verify } from '../../../hooks.js'

export default {
  handler: async ({ accounts: [{ account_id }], body }) => {
    await grpc.storeIntegrations.upsertAll({
      account_id,
      applications: body.requirement_payload,
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
          items: {
            properties: {
              application_id: { type: 'string' },
              country_ids: { items: { type: 'string' }, type: 'array' },
            },
            required: ['application_id', 'country_ids'],
            type: 'object',
          },
          type: 'array',
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
