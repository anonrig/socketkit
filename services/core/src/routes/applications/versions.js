import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ params: { application_id } }) => {
    const { rows } = await grpc.applications.findVersions({ application_id })

    return rows
  },
  method: 'GET',
  path: '/:application_id/versions',
  preHandler: verify,
  schema: {
    params: {
      properties: {
        application_id: { type: 'string' },
      },
      required: ['application_id'],
      type: 'object',
    },
    response: {
      200: {
        items: {
          properties: {
            released_at: { type: 'string' },
            version: { type: 'string' },
          },
          required: ['version', 'released_at'],
          type: 'object',
        },
        type: 'array',
      },
    },
  },
}
