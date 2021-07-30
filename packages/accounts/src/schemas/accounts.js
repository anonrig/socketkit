export const findOrCreate = {
  type: 'object',
  properties: {
    owner_identity_id: { type: 'string', format: 'uuid' },
    account_name: { type: 'string', minLength: 3 },
  },
  required: ['owner_identity_id', 'account_name'],
}

export const findInvitations = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
  },
  required: ['account_id'],
}

export const update = {
  type: 'object',
  properties: {
    identity_id: { type: 'string', format: 'uuid' },
    account_id: { type: 'string', format: 'uuid' },
    account_name: { type: 'string', minLength: 3 },
  },
  required: ['identity_id', 'account_id', 'account_name'],
}

export const invite = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
  },
  required: ['account_id', 'email'],
}

export const findMembers = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
  },
  required: ['account_id'],
}

export const removeMember = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    identity_id: { type: 'string', format: 'uuid' },
  },
  required: ['account_id', 'identity_id'],
}
