export const send = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    provider_id: { type: 'string', enum: ['slack', 'discord', 'email'] },
    properties: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', minLength: 1 },
          value: { type: 'string', minLength: 1 },
        },
        required: ['key', 'value'],
      },
    },
  },
  required: ['account_id', 'provider_id', 'properties'],
}
