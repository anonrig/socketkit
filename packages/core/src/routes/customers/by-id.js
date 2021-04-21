import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:client_id',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          client_id: { type: 'string' },
          total_base_client_purchase: { type: 'string' },
          total_base_developer_proceeds: { type: 'string' },
          device_type_id: { type: 'string' },
          device_type_name: { type: 'string' },
          provider_id: { type: 'string' },
          country_id: { type: 'string' },
        },
        required: [
          'client_id',
          'total_base_client_purchase',
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
  handler: async ({ accounts: [account], params: { client_id } }) => {
    const { row } = await grpc.clients.findOne({
      account_id: account.account_id,
      client_id,
    })

    return row
  },
}
