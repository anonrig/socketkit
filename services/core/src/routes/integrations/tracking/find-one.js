import { verify } from '../../../hooks.js'
import grpc from '../../../grpc.js'

export default {
  method: 'GET',
  path: '/:application_id',
  preHandler: verify,
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
          title: { type: 'string' },
          authorization_key: { type: 'string' },
          application_key: { type: 'string' },
          session_timeout: { type: 'number' },
          is_active: { type: 'boolean' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
        },
        required: [
          'application_id',
          'title',
          'authorization_key',
          'application_key',
          'session_timeout',
          'is_active',
          'created_at',
          'updated_at',
        ],
      },
    },
  },
  handler: async (
    { accounts: [{ account_id }], params: { application_id } },
    reply,
  ) => {
    grpc.trackingApplications.findOne(
      {
        account_id,
        application_id,
      },
      (error, response) => {
        if (error) reply.internalServerError(error)
        else if (!response?.row) reply.notFound('Application not found')
        else
          reply.send({
            ...response.row,
            authorization_key:
              response.row.authorization_key.toString('base64'),
            application_key: response.row.application_key.toString('base64'),
          })
      },
    )
  },
}
