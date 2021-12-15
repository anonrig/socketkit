import grpc from '../../../grpc.js'
import { verify } from '../../../hooks.js'

export default {
  handler: async (
    { accounts: [{ account_id }], params: { application_id }, body: { title, session_timeout } },
    reply,
  ) =>
    grpc.trackingApplications.update(
      {
        account_id,
        application_id,
        session_timeout,
        title,
      },
      (error) => {
        if (error) reply.internalServerError(error)
        else reply.send({})
      },
    ),
  method: 'PUT',
  path: '/:application_id',
  preHandler: verify,
  schema: {
    body: {
      properties: {
        session_timeout: { minimum: 30, type: 'number' },
        title: { type: 'string' },
      },
      required: ['title', 'session_timeout'],
      type: 'object',
    },
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
