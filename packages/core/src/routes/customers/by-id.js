import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:subscriber_id',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          subscriber_id: { type: 'string' },
          total_base_subscriber_purchase: { type: 'string' },
          total_base_developer_proceeds: { type: 'string' },
          device_type_id: { type: 'string' },
          device_type_name: { type: 'string' },
          provider_id: { type: 'string' },
          country_id: { type: 'string' },
        },
        required: [
          'subscriber_id',
          'total_base_subscriber_purchase',
          'total_base_developer_proceeds',
          'device_type_id',
          'device_type_name',
          'provider_id',
          'country_id',
        ],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { subscriber_id } }) => {
    const { row } = await grpc.subscribers.findOne({
      account_id: account.account_id,
      subscriber_id,
    })

    return row
  },
}
