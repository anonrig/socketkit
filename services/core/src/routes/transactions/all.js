import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

const region_names = new Intl.DisplayNames(['en'], { type: 'region' })

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
            subscriber_id: { type: 'string' },
            event_date: { type: 'string' },
          },
          required: ['subscriber_id', 'event_date'],
        },
        start_date: {
          type: 'string',
          format: 'date',
        },
        end_date: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['start_date', 'end_date'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          cursor: {
            type: ['object', 'null'],
            properties: {
              subscriber_id: { type: 'string' },
              event_date: { type: 'string' },
            },
            required: ['subscriber_id', 'event_date'],
          },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                subscriber_id: { type: 'string' },
                transaction_type: { type: 'string' },
                event_date: { type: 'string' },
                base_subscriber_purchase: { type: 'string' },
                base_developer_proceeds: { type: 'string' },
                subscription_package_id: { type: 'string' },
                subscription_package_name: { type: 'string' },
                application_id: { type: 'string' },
                country_id: { type: 'string' },
                country_name: { type: 'string' },
              },
              required: [
                'subscriber_id',
                'transaction_type',
                'event_date',
                'base_subscriber_purchase',
                'base_developer_proceeds',
                'subscription_package_id',
                'subscription_package_name',
                'application_id',
                'country_id',
                'country_name',
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
    const { rows, cursor } = await grpc.transactions.findAll({
      account_id: account.account_id,
      limit: query.limit,
      start_date: query.start_date,
      end_date: query.end_date,
      cursor: query.cursor,
    })

    return {
      rows: rows.map(({ country_id, ...rest }) => ({
        country_id,
        country_name: region_names.of(country_id.toUpperCase()),
        ...rest,
      })),
      cursor,
    }
  },
}
