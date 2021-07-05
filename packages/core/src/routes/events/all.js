import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        application_id: { type: 'string' },
        limit: {
          type: 'number',
          default: 10,
        },
        cursor: {
          type: 'object',
          properties: {
            created_at: { type: 'string' },
          },
          required: ['created_at'],
        },
      },
      required: [],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                application_id: { type: 'string' },
                client_id: { type: 'string' },
                title: { type: 'string' },
                properties: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    required: ['key', 'value'],
                  },
                },
                session_started_at: { type: 'string' },
                created_at: { type: 'string' },
              },
            },
            required: [
              'application_id',
              'client_id',
              'title',
              'session_started_at',
              'created_at',
            ],
          },
          cursor: {
            type: ['object', 'null'],
            properties: {
              created_at: { type: 'string' },
            },
            required: ['created_at'],
          },
        },
        required: ['rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [{ account_id }], query }, reply) => {
    grpc.events.findAll(
      {
        account_id,
        application_id: query.application_id,
        limit: query.limit,
        cursor: query.cursor,
      },
      (error, response) => {
        if (error) reply.internalServerError(error)
        else reply.send(response)
      },
    )
  },
}
