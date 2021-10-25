import { verify } from '../../../hooks.js'
import grpc from '../../../grpc.js'

export default {
  method: 'GET',
  path: '/',
  preHandler: verify,
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            application_id: { type: 'string' },
            title: { type: 'string' },
            is_active: { type: 'boolean' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
          required: [
            'application_id',
            'title',
            'is_active',
            'created_at',
            'updated_at',
          ],
        },
      },
    },
  },
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
}
