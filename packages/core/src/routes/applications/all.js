import { verify } from '../../hooks.js'
import f from '../../server.js'

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
                provider_id: { type: 'string' },
                application_id: { type: 'string' },
                title: { type: 'string' },
                subscription_package_count: { type: 'number' },
                version: { type: 'string' },
                ratings: { type: 'array', items: { type: 'number' } },
                icon: { type: 'string' },
                released_at: { type: 'string' },
                updated_at: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account] }) => {
    if (!account) {
      return []
    }

    const applications = await f.grpc.subscriptions.groupByApplication({
      account_id: account.account_id,
    })

    const application_ids = applications.rows.map((app) => app.application_id)

    const { rows: storedApplications } = await f.grpc.applications.findAll({
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
