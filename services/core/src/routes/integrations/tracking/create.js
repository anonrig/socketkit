import grpc from '../../../grpc.js'
import { verify } from '../../../hooks.js'

export default {
  handler: async (
    { accounts: [{ account_id }], body: { application_id, title, session_timeout } },
    reply,
  ) =>
    grpc.trackingApplications.create(
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
  method: 'POST',
  path: '/',
  preHandler: verify,
  schema: {
    body: {
      properties: {
        application_id: { type: 'string' },
        session_timeout: { minimum: 30, type: 'number' },
        title: { type: 'string' },
      },
      required: ['application_id', 'title', 'session_timeout'],
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
