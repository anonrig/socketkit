export const email = {
  type: 'object',
  properties: {
    to: { type: 'string', format: 'email' },
  },
  required: ['to'],
  additionalProperties: false,
  errorMessage: {
    type: 'should be a string',
    required: 'email is required',
    additionalProperties: 'only to field is accepted',
  },
}

export const slack = {
  type: 'object',
  properties: {
    url: { type: 'string', format: 'url' },
  },
  required: ['url'],
  additionalProperties: false,
  errorMessage: {
    type: 'should be a string',
    required: 'url is required',
    additionalProperties: 'only url field is accepted',
  },
}

export const discord = {
  type: 'object',
  properties: {
    url: { type: 'string', format: 'url' },
  },
  required: ['url'],
  additionalProperties: false,
  errorMessage: {
    type: 'should be a string',
    required: 'url is required',
    additionalProperties: 'only url field is accepted',
  },
}
