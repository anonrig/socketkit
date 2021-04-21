import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/versions/:application_id',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                version: { type: 'string' },
                released_at: { type: 'string' },
              },
              required: ['version'],
            },
          },
        },
        required: ['rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({
    accounts: [{ account_id }],
    params: { application_id },
  }) => {
    const { rows: integrations } = await grpc.storeIntegrations.findAll({
      account_id: account_id,
    })

    if (integrations.length === 0) {
      return { rows: [] }
    }

    const existing = integrations.find(
      (i) => i.application_id === application_id,
    )

    if (!existing) {
      return { rows: [] }
    }

    return grpc.reviews.findVersions({ application_id })
  },
}
