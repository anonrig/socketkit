import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
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
        ...(rows.filter((r) => r.application_id === application.application_id)[0] ?? {}),
      })),
    }
  },
  method: 'GET',
  path: '/',
  preHandler: verify,
  schema: {
    response: {
      200: {
        properties: {
          rows: {
            items: {
              properties: {
                application_icon: { type: 'string' },
                application_id: { type: 'string' },
                title: { type: 'string' },
              },
              required: ['application_id', 'application_icon', 'title'],
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
