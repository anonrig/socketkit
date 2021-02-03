import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/:application_id/transactions',
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
  handler: async ({
    accounts: [account],
    query,
    params: { application_id },
  }) => {
    if (!account) {
      throw f.httpErrors.notFound(`Account not found`)
    }

    return f.grpc.transactions.findAll({
      where: {
        account_id: account.account_id,
        application_id,
      },
      opts: {
        limit: query.limit,
        page: query.page,
        filter: {
          from: query.from,
          to: query.to,
        },
      },
    })
  },
}
