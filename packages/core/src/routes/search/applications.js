import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/applications',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        text: { type: 'string' },
      },
      required: ['text'],
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            application_id: { type: 'string' },
            application_title: { type: 'string' },
            application_icon: { type: 'string' },
            bundle_id: { type: 'string' },
          },
          required: [
            'application_id',
            'bundle_id',
            'application_title',
            'application_icon',
          ],
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ query }) => {
    const { rows } = await grpc.applications.search({
      text: query.text,
    })

    return rows
  },
}
