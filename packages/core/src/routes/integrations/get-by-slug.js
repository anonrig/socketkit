import { verify } from '../../hooks.js'
import f from '../../server.js'
import { getIntegration } from '../../methods/integrations.js'

export default {
  method: 'GET',
  path: '/:integration_id',
  schema: {
    response: {
      200: { $ref: 'integration' },
    },
  },
  preHandler: verify,
  handler: async ({ params: { integration_id } }) =>
    getIntegration({ integration_id }),
}
