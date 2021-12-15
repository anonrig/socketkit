import grpc from '../../../grpc.js'
import { verify } from '../../../hooks.js'

export default {
  handler: async ({ accounts: [{ account_id }], params: { application_id } }, reply) =>
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
  method: 'DELETE',
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
        properties: {},
        required: [],
        type: 'object',
      },
    },
  },
}
