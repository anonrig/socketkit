import { verify, kratos_private } from '../../hooks.js'
import { getAccountIdentities } from '../../models/accounts.js'

export default {
  method: 'GET',
  path: '/users',
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
                identity_id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                member_since: { type: 'string' },
              },
              required: [
                'identity_id',
                'name',
                'email',
                'role',
                'member_since',
              ],
            },
          },
        },
        required: ['rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts }) => {
    const users = await getAccountIdentities({
      account_ids: accounts.map((account) => account.account_id),
    })

    const identities = (
      await Promise.all(
        users.map((user) => kratos_private.getIdentity(user.identity_id)),
      )
    ).map((i) => i.data)

    return {
      rows: identities.map((identity) => ({
        identity_id: identity.id,
        name: identity.traits.name,
        email: identity.traits.email,
        role:
          users.find((u) => u.identity_id === identity.id).account_role ??
          'unknown',
        member_since:
          users.find((u) => u.identity_id === identity.id).created_at ??
          new Date(),
      })),
    }
  },
}
