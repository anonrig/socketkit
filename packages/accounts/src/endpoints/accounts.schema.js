export const findAll = {
  type: 'object',
  properties: {
    identity_id: { type: 'string', format: 'uuid' },
  },
  required: ['identity_id'],
}

export const update = {
  type: 'object',
  properties: {
    identity_id: { type: 'string', format: 'uuid' },
    account_id: { type: 'string', format: 'uuid' },
    name: { type: 'string', minLength: 3 },
  },
  required: ['identity_id', 'account_id', 'name'],
}

export const findMembers = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
  },
  required: ['account_id'],
}

export const addMember = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    identity_id: { type: 'string', format: 'uuid' },
  },
  required: ['account_id', 'identity_id'],
}

export const removeMember = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    identity_id: { type: 'string', format: 'uuid' },
  },
  required: ['account_id', 'identity_id'],
}
