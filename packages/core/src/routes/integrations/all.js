import { verify } from '../../hooks.js'
import { getIntegrations } from '../../methods/integrations.js'

export default {
  method: 'GET',
  path: '/',
  schema: {
    response: {
      200: {
        type: 'array',
        items: { $ref: 'integration' },
      },
    },
  },
  preHandler: verify,
  handler: async () => getIntegrations(),
}
