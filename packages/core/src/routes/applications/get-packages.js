import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/:application_id/packages',
  schema: {
    query: {
      type: 'object',
      properties: {
        limit: { type: ['number', 'null'], default: 10, minimum: 10 },
        page: {
          type: ['number', 'null'],
          default: 1,
          minimum: 1,
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], params: { application_id } }) => {
    if (!account) {
      throw f.httpErrors.notFound(`Account not found`)
    }

    return f.grpc.applications.findSubscriptionPackages({
      where: {
        account_id: account.account_id,
        application_id,
      },
    })
  },
}
