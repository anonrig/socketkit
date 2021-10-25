import grpc from '../../grpc.js'

export default {
  method: 'POST',
  path: '/webhook',
  config: { rawBody: true },
  schema: {
    headers: {
      type: 'object',
      properties: {
        'stripe-signature': { type: 'string' },
      },
      required: ['stripe-signature'],
    },
  },
  handler: async ({ rawBody, headers }) =>
    grpc.payments.validateWebhook({
      payload: rawBody,
      signature: headers['stripe-signature'],
    }),
}
