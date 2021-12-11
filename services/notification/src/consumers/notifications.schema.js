export const send = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    properties: {
      items: {
        properties: {
          key: { minLength: 1, type: 'string' },
          value: { minLength: 1, type: 'string' },
        },
        required: ['key', 'value'],
        type: 'object',
      },
      type: 'array',
    },
    provider_id: { enum: ['slack', 'discord', 'email'], type: 'string' },
  },
  required: ['account_id', 'provider_id', 'properties'],
  type: 'object',
}
