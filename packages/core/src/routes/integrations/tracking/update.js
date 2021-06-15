import { verify } from '../../../hooks.js'
import grpc from '../../../grpc.js'

export default {
  method: 'PUT',
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
    body: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        session_timeout: { type: 'number', minimum: 30 },
      },
      required: ['title', 'session_timeout'],
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
      params: { application_id },
      body: { title, session_timeout },
    },
    reply,
  ) =>
    grpc.trackingApplications.update(
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
