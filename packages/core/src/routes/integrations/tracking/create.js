import { verify } from '../../../hooks.js'
import grpc from '../../../grpc.js'

export default {
  method: 'POST',
  path: '/',
  preHandler: verify,
  schema: {
    body: {
      type: 'object',
      properties: {
        application_id: { type: 'string' },
        title: { type: 'string' },
        session_timeout: { type: 'number', minimum: 30 },
      },
      required: ['application_id', 'title', 'session_timeout'],
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
    {
      accounts: [{ account_id }],
      body: { application_id, title, session_timeout },
    },
    reply,
  ) =>
    grpc.trackingApplications.create(
      {
        account_id,
        application_id,
        title,
        session_timeout,
      },
      (error) => {
        if (error) reply.internalServerError(error)
        else reply.send({})
      },
    ),
}
