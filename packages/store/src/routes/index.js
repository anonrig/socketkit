import * as Fastify from 'fastify'

import search from './search.js'

/**
 * @param {Fastify.FastifyInstance} f
 */
export default function routes(f, _opts, done) {
  f.route({
    method: 'GET',
    url: '/search',
    preHandler: null,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          keyword: { type: 'string' },
          country_id: { type: 'string' },
        },
        required: ['keyword'],
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              bundle: { type: 'string' },
              title: { type: 'string' },
              url: { type: 'string' },
              developer_id: { type: 'string' },
              developer_name: { type: 'string' },
            },
          },
        },
      },
    },
    handler: search,
  })

  done()
}
