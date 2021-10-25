import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:subscriber_id/subscriptions',
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            subscription_active_period: {
              type: 'array',
              items: { type: 'string' },
            },
            subscription_package_id: { type: 'string' },
            subscription_package_name: { type: 'string' },
            application_id: { type: 'string' },
            application_name: { type: 'string' },
          },
          required: [
            'subscription_active_period',
            'subscription_package_id',
            'subscription_package_name',
            'application_id',
            'application_name',
          ],
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { subscriber_id } }) => {
    const { rows } = await grpc.subscribers.findSubscriptions({
      account_id: account.account_id,
      subscriber_id,
    })

    const application_ids = rows.map(({ application_id }) => application_id)
    const applications = await grpc.applications.findAll({ application_ids })

    return rows.map((row) => ({
      ...row,
      application_name: applications.rows.find(
        (a) => a.application_id === row.application_id,
      )?.title,
    }))
  },
}
