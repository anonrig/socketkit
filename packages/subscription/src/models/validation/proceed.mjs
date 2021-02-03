export default {
  type: 'object',
  properties: {
    amount: { type: 'number' },
    currency: { type: 'number' },
  },
  required: ['amount', 'currency'],
  additionalProperties: false,
}
