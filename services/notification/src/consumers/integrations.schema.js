import * as Providers from '../pg/integration.schema.js'

export const findAll = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    provider_id: { type: 'string', enum: ['slack', 'discord', 'email'] },
  },
  required: ['account_id'],
}

export const upsert = {
  type: 'object',
  oneOf: [
    {
      properties: {
        provider_id: { enum: ['discord'] },
        account_id: { type: 'string', format: 'uuid' },
        requirement: Providers.discord,
      },
      required: ['account_id', 'properties'],
    },
    {
      properties: {
        provider_id: { enum: ['email'] },
        account_id: { type: 'string', format: 'uuid' },
        requirement: Providers.email,
      },
      required: ['account_id', 'properties'],
    },
    {
      properties: {
        provider_id: { enum: ['slack'] },
        account_id: { type: 'string', format: 'uuid' },
        requirement: Providers.slack,
      },
      required: ['account_id', 'properties'],
    },
  ],
  required: ['account_id', 'provider_id', 'requirement'],
}

export const destroy = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    provider_id: { type: 'string', enum: ['slack', 'discord', 'email'] },
  },
  required: ['account_id'],
}
