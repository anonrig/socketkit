import { verify } from '../../hooks.js'
import f from '../../server.js'

export default {
  method: 'GET',
  path: '/:application_id/statistics',
  preHandler: verify,
  handler: async ({ accounts: [account], params: { application_id } }) => {
    if (!account) {
      throw f.httpErrors.notFound(`Account not found`)
    }

    return f.grpc.applications.statistics({
      account_id: account.account_id,
      application_id,
    })
  },
}
