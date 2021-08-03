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
                client: {
                  type: 'object',
                  properties: {
                    application_id: { type: 'string' },
                    distinct_id: { type: 'string' },
                    country_id: { type: 'string' },
                    device_locale: { type: 'string' },
                    device_manufacturer: { type: 'string' },
                    device_platform: { type: 'string' },
                    device_type: { type: 'string' },
                    device_height: { type: 'number' },
                    device_width: { type: 'number' },
                    device_carrier: { type: 'string' },
                    os_name: { type: 'string' },
                    watch_model: { type: 'string' },
                    application_build_number: { type: 'number' },
                    application_version: { type: 'string' },
                    library_version: { type: 'string' },
                    created_at: { type: 'string' },
                    updated_at: { type: 'string' },
                  },
                  required: ['application_id', 'country_id'],
                },
              },
              required: [
                'application_id',
                'client_id',
                'title',
                'session_started_at',
                'created_at',
                'client',
              ],
            },
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
