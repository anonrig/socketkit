import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/:application_id',
  schema: {
    params: {
      type: 'object',
      properties: {
        application_id: { type: 'string' },
      },
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
          updated_at: { type: 'string' },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { application_id } }) => {
    if (!account) {
      throw f.httpErrors.notFound(`Account not found`)
    }

    const { application } = await f.grpc.store.findOne({
      application_id,
    })

    return application
  },
}
