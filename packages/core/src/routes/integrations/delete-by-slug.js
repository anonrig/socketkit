import { verify } from '../../hooks.js'
import f from '../../server.js'
import { createAccount } from '../../methods/accounts.js'

export default {
  method: 'DELETE',
  path: '/:integration_id',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          state: { type: 'boolean' },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({
    user: { identity },
    accounts: [account],
    params: { integration_id },
  }) => {
    if (integration_id !== 'appstore-connect') {
      throw f.httpErrors.notFound()
    }

    if (!account) {
      account = await createAccount({ identity_id: identity.id })
    }

    await f.grpc.integrations.destroy({
      account_id: account.account_id,
      provider_id: 'apple',
    })

    return { state: true }
  },
}
