import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

const region_names = new Intl.DisplayNames(['en'], { type: 'region' })

export default {
  handler: async ({ accounts: [account], params: { subscriber_id } }) => {
    const { row } = await grpc.subscribers.findOne({
      account_id: account.account_id,
      subscriber_id,
    })

    return {
      country_name: region_names.of(row.country_id.toUpperCase()),
      ...row,
    }
  },
  method: 'GET',
  path: '/:subscriber_id',
  preHandler: verify,
  schema: {
    response: {
      200: {
        properties: {
          country_id: { type: 'string' },
          country_name: { type: 'string' },
          device_type_id: { type: 'string' },
          device_type_name: { type: 'string' },
          provider_id: { type: 'string' },
          subscriber_id: { type: 'string' },
          total_base_developer_proceeds: { type: 'string' },
          total_base_subscriber_purchase: { type: 'string' },
        },
        required: [
          'subscriber_id',
          'total_base_subscriber_purchase',
          'total_base_developer_proceeds',
          'device_type_id',
          'device_type_name',
          'provider_id',
          'country_id',
          'country_name',
        ],
        type: 'object',
      },
    },
  },
}
