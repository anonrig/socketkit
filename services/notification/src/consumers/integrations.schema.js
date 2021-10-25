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
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    provider_id: { type: 'string', enum: ['slack', 'discord', 'email'] },
    requirement: {
      type: 'object',
      properties: {
        url: { type: 'string', minLength: 1 },
      },
      required: [],
    },
    select: { $data: '0/provider_id' },
    selectCases: {
      discord: { properties: { requirement: Providers.discord } },
      email: { properties: { requirement: Providers.email } },
      slack: { properties: { requirement: Providers.slack } },
    },
    selectDefault: false,
  },
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
