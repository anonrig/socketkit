import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ query }) => {
    const { rows } = await grpc.applications.search({
      text: query.text,
    })

    return rows
  },
  method: 'GET',
  path: '/applications',
  preHandler: verify,
  schema: {
    querystring: {
      properties: {
        text: { type: 'string' },
      },
      required: ['text'],
      type: 'object',
    },
    response: {
      200: {
        items: {
          properties: {
            application_icon: { type: 'string' },
            application_id: { type: 'string' },
            application_title: { type: 'string' },
            bundle_id: { type: 'string' },
          },
          required: ['application_id', 'bundle_id', 'application_title', 'application_icon'],
          type: 'object',
        },
        type: 'array',
      },
    },
  },
}
