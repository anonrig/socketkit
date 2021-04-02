import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:application_id/versions',
  schema: {
    params: {
      type: 'object',
      properties: {
        application_id: { type: 'string' },
      },
      required: ['application_id'],
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            version: { type: 'string' },
            released_at: { type: 'string' },
          },
          required: ['version', 'released_at'],
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ params: { application_id } }) => {
    const { rows } = await grpc.applications.findVersions({ application_id })

    return rows
  },
}
