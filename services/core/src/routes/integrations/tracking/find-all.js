import grpc from '../../../grpc.js'
import { verify } from '../../../hooks.js'

export default {
  handler: async ({ accounts: [{ account_id }] }, reply) => {
    grpc.trackingApplications.findAll(
      {
        account_id,
      },
      (error, response) => {
        if (error) reply.internalServerError(error)
        else reply.send(response.rows)
      },
    )
  },
  method: 'GET',
  path: '/',
  preHandler: verify,
  schema: {
    response: {
      200: {
        items: {
          properties: {
            application_id: { type: 'string' },
            created_at: { type: 'string' },
            is_active: { type: 'boolean' },
            title: { type: 'string' },
            updated_at: { type: 'string' },
          },
          required: ['application_id', 'title', 'is_active', 'created_at', 'updated_at'],
          type: 'object',
        },
        type: 'array',
      },
    },
  },
}
