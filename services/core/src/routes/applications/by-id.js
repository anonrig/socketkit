import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:application_id',
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
        type: 'object',
        properties: {
          application_id: { type: 'string' },
          developer_id: { type: 'string' },
          bundle_id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          release_notes: { type: 'string' },
          icon: { type: 'string' },
          store_url: { type: 'string' },
          languages: { type: 'string' },
          screenshots: {
            type: 'object',
            properties: {
              default: { type: 'array', items: { type: 'string' } },
              ipad: { type: 'array', items: { type: 'string' } },
              appletv: { type: 'array', items: { type: 'string' } },
            },
            required: ['default'],
          },
          version: { type: 'string' },
          ratings: { type: 'array', items: { type: 'number' } },
          released_at: { type: 'string' },
          reviews: { type: 'number' },
          score: { type: 'number' },
          developer_url: { type: 'string' },
          price: { type: 'number' },
          currency: { type: 'string' },
          content_rating: { type: 'string' },
          required_os_version: { type: 'string' },
          size: { type: 'string' },
        },
        required: [
          'application_id',
          'developer_id',
          'bundle_id',
          'title',
          'description',
          'release_notes',
          'icon',
          'store_url',
          'languages',
          'screenshots',
          'version',
          'ratings',
          'released_at',
          'reviews',
          'score',
          'developer_url',
          'price',
          'currency',
          'content_rating',
          'required_os_version',
          'size',
        ],
      },
    },
  },
  preHandler: verify,
  handler: async ({ params: { application_id } }, reply) => {
    const { row } = await grpc.applications.findOne({
      application_id,
    })

    return row ?? reply.notFound()
  },
}
