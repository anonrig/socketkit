import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/statistics',
  schema: {
    query: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          format: 'date',
        },
        to: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['from', 'to'],
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [account], query }) => {
    if (!account) {
      throw f.httpErrors.notFound(`Account not found`)
    }

    return f.grpc.accounts.statistics({
      where: { account_id: account.account_id },
      opts: {
        filter: {
          from: query.from,
          to: query.to,
        },
      },
    })
  },
}
