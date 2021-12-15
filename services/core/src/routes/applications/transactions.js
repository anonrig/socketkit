import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

const region_names = new Intl.DisplayNames(['en'], { type: 'region' })

export default {
  handler: async ({ accounts: [account], query, params: { application_id } }) => {
    const { rows, cursor } = await grpc.transactions.findAll({
      account_id: account.account_id,
      application_id,
      cursor: query.cursor,
      end_date: query.end_date,
      limit: query.limit,
      start_date: query.start_date,
    })

    return {
      cursor,
      rows: rows.map(({ country_id, ...rest }) => ({
        country_id,
        country_name: region_names.of(country_id.toUpperCase()),
        ...rest,
      })),
    }
  },
  method: 'GET',
  path: '/:application_id/transactions',
  preHandler: verify,
  schema: {
    params: {
      properties: {
        application_id: { type: 'string' },
      },
      required: ['application_id'],
      type: 'object',
    },
    querystring: {
      properties: {
        cursor: {
          properties: {
            event_date: { type: 'string' },
            subscriber_id: { type: 'string' },
          },
          type: 'object',
        },
        end_date: {
          format: 'date',
          type: 'string',
        },
        limit: { default: 10, minimum: 10, type: 'number' },
        start_date: {
          format: 'date',
          type: 'string',
        },
      },
      required: ['start_date', 'end_date'],
      type: 'object',
    },
    response: {
      200: {
        properties: {
          cursor: {
            properties: {
              event_date: { type: 'string' },
              subscriber_id: { type: 'string' },
            },
            type: ['object', 'null'],
          },
          rows: {
            items: {
              properties: {
                application_id: { type: 'string' },
                base_developer_proceeds: { type: 'string' },
                base_subscriber_purchase: { type: 'string' },
                country_id: { type: 'string' },
                country_name: { type: 'string' },
                event_date: { type: 'string' },
                subscriber_id: { type: 'string' },
                subscription_package_id: { type: 'string' },
                subscription_package_name: { type: 'string' },
                transaction_type: { type: 'string' },
              },
              type: 'object',
            },
            type: 'array',
          },
        },
        required: ['cursor', 'rows'],
        type: 'object',
      },
    },
  },
}
