import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/',
  schema: {
    query: {
      type: 'object',
      properties: {
        limit: { type: ['number', 'null'], default: 10, minimum: 10 },
      },
    },
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
                application_name: { type: 'string' },
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
  handler: async ({ accounts: [account], query }) => {
    if (!account) {
      return []
    }

    const applications = await f.grpc.applications.findAll({
      where: { account_id: account.account_id },
      opts: {
        limit: query.limit,
      },
    })

    const application_ids = applications.rows.map((app) => app.application_id)

    const { applications: storedApplications } = await f.grpc.store.findAll({
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
