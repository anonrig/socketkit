import * as Providers from '../pg/integration.schema.js'

export const findAll = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    provider_id: { enum: ['slack', 'discord', 'email'], type: 'string' },
  },
  required: ['account_id'],
  type: 'object',
}

export const upsert = {
  oneOf: [
    {
      properties: {
        account_id: { format: 'uuid', type: 'string' },
        provider_id: { enum: ['discord'] },
        requirement: Providers.discord,
      },
      required: ['account_id', 'properties'],
    },
    {
      properties: {
        account_id: { format: 'uuid', type: 'string' },
        provider_id: { enum: ['email'] },
        requirement: Providers.email,
      },
      required: ['account_id', 'properties'],
    },
    {
      properties: {
        account_id: { format: 'uuid', type: 'string' },
        provider_id: { enum: ['slack'] },
        requirement: Providers.slack,
      },
      required: ['account_id', 'properties'],
    },
  ],
  required: ['account_id', 'provider_id', 'requirement'],
  type: 'object',
}

export const destroy = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    provider_id: { enum: ['slack', 'discord', 'email'], type: 'string' },
  },
  required: ['account_id'],
  type: 'object',
}
