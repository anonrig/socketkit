export const findOrCreate = {
  type: 'object',
  properties: {
    identity_id: { type: 'string', format: 'uuid' },
    name: { type: 'string', minLength: 3 },
  },
  required: ['identity_id', 'name'],
}
