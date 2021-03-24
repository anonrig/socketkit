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
                title: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account] }) => {
    const applications = await grpc.subscriptions.groupByApplication({
      account_id: account.account_id,
    })

    const application_ids = applications.rows.map((app) => app.application_id)
    const { rows: storedApplications } = await grpc.applications.findAll({
      application_ids,
    })

    return Object.assign({}, applications, {
      rows: applications.rows.map((application) => ({
        ...application,
        ...(storedApplications.filter(
          (a) => a.application_id === application.application_id,
        )[0] ?? {}),
      })),
    })
  },
}
