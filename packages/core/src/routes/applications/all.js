import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/',
  schema: {
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
                application_icon: { type: 'string' },
                title: { type: 'string' },
              },
              required: ['application_id', 'application_icon', 'title'],
            },
          },
        },
        required: ['rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account] }) => {
    const { rows } = await grpc.subscriptions.groupByApplication({
      account_id: account.account_id,
    })

    const application_ids = rows.map((r) => r.application_id)
    const { rows: applications } = await grpc.applications.findAll({
      application_ids,
    })

    return {
      rows: applications.map((application) => ({
        ...application,
        ...(rows.filter(
          (r) => r.application_id === application.application_id,
        )[0] ?? {}),
      })),
    }
  },
}
