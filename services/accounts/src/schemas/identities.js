export const findAccounts = {
  type: 'object',
  properties: {
    identity_id: { type: 'string', format: 'uuid' },
  },
  required: ['identity_id'],
}

export const findInvitations = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email'],
}

export const acceptInvitation = {
  type: 'object',
  properties: {
    identity_id: { type: 'string', format: 'uuid' },
    account_id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
  },
  required: ['identity_id', 'account_id', 'email'],
}

export const rejectInvitation = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
  },
  required: ['account_id', 'email'],
}
