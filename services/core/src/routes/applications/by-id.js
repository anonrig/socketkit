import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ params: { application_id } }, reply) => {
    const { row } = await grpc.applications.findOne({
      application_id,
    })

    return row ?? reply.notFound()
  },
  method: 'GET',
  path: '/:application_id',
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
        properties: {
          application_id: { type: 'string' },
          bundle_id: { type: 'string' },
          content_rating: { type: 'string' },
          currency: { type: 'string' },
          description: { type: 'string' },
          developer_id: { type: 'string' },
          developer_url: { type: 'string' },
          icon: { type: 'string' },
          languages: { type: 'string' },
          price: { type: 'number' },
          ratings: { items: { type: 'number' }, type: 'array' },
          release_notes: { type: 'string' },
          released_at: { type: 'string' },
          required_os_version: { type: 'string' },
          reviews: { type: 'number' },
          score: { type: 'number' },
          screenshots: {
            properties: {
              appletv: { items: { type: 'string' }, type: 'array' },
              default: { items: { type: 'string' }, type: 'array' },
              ipad: { items: { type: 'string' }, type: 'array' },
            },
            required: ['default'],
            type: 'object',
          },
          size: { type: 'string' },
          store_url: { type: 'string' },
          title: { type: 'string' },
          version: { type: 'string' },
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
        type: 'object',
      },
    },
  },
}
