import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ accounts: [{ account_id }], params: { application_id } }) => {
    const { rows: integrations } = await grpc.storeIntegrations.findAll({
      account_id: account_id,
    })

    if (integrations.length === 0) {
      return { rows: [] }
    }

    const existing = integrations.find((i) => i.application_id === application_id)

    if (!existing) {
      return { rows: [] }
    }

    return grpc.reviews.findVersions({ application_id })
  },
  method: 'GET',
  path: '/versions/:application_id',
  preHandler: verify,
  schema: {
    response: {
      200: {
        properties: {
          rows: {
            items: {
              properties: {
                released_at: { type: 'string' },
                version: { type: 'string' },
              },
              required: ['version'],
              type: 'object',
            },
            type: 'array',
          },
        },
        required: ['rows'],
        type: 'object',
      },
    },
  },
}
