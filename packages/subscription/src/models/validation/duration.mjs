export default {
  type: 'object',
  properties: {
    type: { type: 'string' },
    value: { type: 'number', minimum: 0 },
    period: { type: 'string', enum: ['day', 'week', 'month'] },
  },
  required: ['type', 'value', 'period'],
  additionalProperties: false,
}
