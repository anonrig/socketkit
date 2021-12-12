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
  discriminator: { propertyName: 'provider_id' },
  oneOf: [
    {
      properties: {
        account_id: { format: 'uuid', type: 'string' },
        provider_id: { enum: ['discord'], type: 'string' },
        requirement: Providers.discord,
      },
    },
    {
      properties: {
        account_id: { format: 'uuid', type: 'string' },
        provider_id: { enum: ['email'], type: 'string' },
        requirement: Providers.email,
      },
    },
    {
      properties: {
        account_id: { format: 'uuid', type: 'string' },
        provider_id: { enum: ['slack'], type: 'string' },
        requirement: Providers.slack,
      },
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
