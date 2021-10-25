import { verify } from '../../../hooks.js'
import grpc from '../../../grpc.js'

export default {
  method: 'DELETE',
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
        properties: {},
        required: [],
      },
    },
  },
  handler: async (
    { accounts: [{ account_id }], params: { application_id } },
    reply,
  ) =>
    grpc.trackingApplications.destroy(
      {
        account_id,
        application_id,
      },
      (error) => {
        if (error) reply.internalServerError(error)
        else reply.send({})
      },
    ),
}
