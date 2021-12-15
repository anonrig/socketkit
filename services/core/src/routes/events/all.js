import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ accounts: [{ account_id }], query }, reply) => {
    grpc.events.findAll(
      {
        account_id,
        application_id: query.application_id,
        cursor: query.cursor,
        limit: query.limit,
      },
      (error, response) => {
        if (error) reply.internalServerError(error)
        else reply.send(response)
      },
    )
  },
  method: 'GET',
  path: '/',
  preHandler: verify,
  schema: {
    querystring: {
      properties: {
        application_id: { type: 'string' },
        cursor: {
          properties: {
            created_at: { type: 'string' },
          },
          required: ['created_at'],
          type: 'object',
        },
        limit: {
          default: 10,
          type: 'number',
        },
      },
      required: [],
      type: 'object',
    },
    response: {
      200: {
        properties: {
          cursor: {
            properties: {
              created_at: { type: 'string' },
            },
            required: ['created_at'],
            type: ['object', 'null'],
          },
          rows: {
            items: {
              properties: {
                application_id: { type: 'string' },
                client: {
                  properties: {
                    application_build_number: { type: 'number' },
                    application_id: { type: 'string' },
                    application_version: { type: 'string' },
                    country_id: { type: 'string' },
                    created_at: { type: 'string' },
                    device_carrier: { type: 'string' },
                    device_height: { type: 'number' },
                    device_locale: { type: 'string' },
                    device_manufacturer: { type: 'string' },
                    device_platform: { type: 'string' },
                    device_type: { type: 'string' },
                    device_width: { type: 'number' },
                    distinct_id: { type: 'string' },
                    library_version: { type: 'string' },
                    os_name: { type: 'string' },
                    updated_at: { type: 'string' },
                    watch_model: { type: 'string' },
                  },
                  required: ['application_id', 'country_id'],
                  type: 'object',
                },
                client_id: { type: 'string' },
                created_at: { type: 'string' },
                properties: {
                  items: {
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    required: ['key', 'value'],
                    type: 'object',
                  },
                  type: 'array',
                },
                session_started_at: { type: 'string' },
                title: { type: 'string' },
              },
              required: [
                'application_id',
                'client_id',
                'title',
                'session_started_at',
                'created_at',
                'client',
              ],
              type: 'object',
            },
            type: 'array',
          },
        },
        required: ['rows'],
        type: 'object',
      },
    },
  },
}
