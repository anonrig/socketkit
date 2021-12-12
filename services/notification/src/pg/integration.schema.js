export const email = {
  additionalProperties: false,
  errorMessage: {
    required: 'email is required',
    type: 'should be a string',
  },
  properties: {
    email: { format: 'email', type: 'string' },
  },
  required: ['email'],
  type: 'object',
}

export const slack = {
  additionalProperties: false,
  errorMessage: {
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
    required: 'url is required',
    type: 'should be a string',
  },
  properties: {
    url: { format: 'url', type: 'string' },
  },
  required: ['url'],
  type: 'object',
}
