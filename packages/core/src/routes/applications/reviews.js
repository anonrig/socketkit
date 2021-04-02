import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/:application_id/reviews',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        cursor: {
          type: 'object',
          properties: {
            review_id: { type: 'string' },
          },
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          cursor: {
            type: ['object', 'null'],
            properties: {
              review_id: { type: 'string' },
            },
          },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                review_id: { type: 'string' },
                application_id: { type: 'string' },
                version_number: { type: 'string' },
                country_id: { type: 'string' },
                score: { type: 'number' },
                username: { type: 'string' },
                user_url: { type: 'string' },
                review_url: { type: 'string' },
                title: { type: 'string' },
                content: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  preHandler: verify,
  handler: async ({ params: { application_id }, query }) => {
    return grpc.reviews.findAll({
      application_id,
      cursor: query.cursor,
    })
  },
}
