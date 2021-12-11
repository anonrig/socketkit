export const email = {
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'only to field is accepted',
    required: 'email is required',
    type: 'should be a string',
  },
  properties: {
    to: { format: 'email', type: 'string' },
  },
  required: ['to'],
  type: 'object',
}

export const slack = {
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'only url field is accepted',
    required: 'url is required',
    type: 'should be a string',
  },
  properties: {
    url: { format: 'url', type: 'string' },
  },
  required: ['url'],
  type: 'object',
}

export const discord = {
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'only url field is accepted',
    required: 'url is required',
    type: 'should be a string',
  },
  properties: {
    url: { format: 'url', type: 'string' },
  },
  required: ['url'],
  type: 'object',
}
