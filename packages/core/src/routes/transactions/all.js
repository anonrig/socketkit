import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        limit: { type: ['number', 'null'], default: 10, minimum: 10 },
        cursor: {
          type: 'object',
          properties: {
            client_id: { type: 'string' },
            event_date: { type: 'string' },
          },
          required: ['client_id', 'event_date'],
        },
        from: {
          type: 'string',
          format: 'date',
        },
        to: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['from', 'to'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          cursor: {
            type: ['object', 'null'],
            properties: {
              client_id: { type: 'string' },
              event_date: { type: 'string' },
            },
            required: ['client_id', 'event_date'],
          },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                client_id: { type: 'string' },
                transaction_type: { type: 'string' },
                event_date: { type: 'string' },
                base_client_purchase: { type: 'string' },
                base_developer_proceeds: { type: 'string' },
                subscription_package_id: { type: 'string' },
                subscription_package_name: { type: 'string' },
                application_id: { type: 'string' },
                country_id: { type: 'string' },
              },
              required: [
                'client_id',
                'transaction_type',
                'event_date',
                'base_client_purchase',
                'base_developer_proceeds',
                'subscription_package_id',
                'subscription_package_name',
                'application_id',
                'country_id',
              ],
            },
          },
        },
        required: ['cursor', 'rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], query }) => {
    return grpc.transactions.findAll({
      account_id: account.account_id,
      limit: query.limit,
      start_date: query.from,
      end_date: query.to,
      cursor: query.cursor,
    })
  },
}
