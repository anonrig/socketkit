import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/:application_id/transactions',
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
            type: 'object',
            properties: {
              client_id: { type: 'string' },
              event_date: { type: 'string' },
            },
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
                application_name: { type: 'string' },
                country_id: { type: 'string' },
                country_name: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({
    accounts: [account],
    query,
    params: { application_id },
  }) => {
    if (!account) {
      throw f.httpErrors.notFound(`Account not found`)
    }

    return f.grpc.transactions.findAll({
      account_id: account.account_id,
      application_id,
      limit: query.limit,
      start_date: query.from,
      end_date: query.to,
      cursor: query.cursor,
    })
  },
}
