import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        application_id: { type: 'string' },
        country_id: { type: 'string' },
        version: { type: 'string' },
        cursor: {
          type: 'object',
          properties: {
            review_id: { type: 'string' },
            updated_at: { type: 'string' },
          },
          required: ['review_id', 'updated_at'],
        },
      },
      required: [],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          cursor: {
            type: ['object', 'null'],
            properties: {
              review_id: { type: 'string' },
              updated_at: { type: 'string' },
            },
            required: ['review_id', 'updated_at'],
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
              required: [
                'review_id',
                'application_id',
                'version_number',
                'country_id',
                'score',
                'username',
                'user_url',
                'review_url',
                'title',
                'content',
              ],
            },
          },
        },
        required: ['cursor', 'rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({
    accounts: [{ account_id }],
    query: { cursor, application_id, country_id, version },
  }) => {
    const country_ids = !!country_id ? [country_id] : []
    const { rows: integrations } = await grpc.storeIntegrations.findAll({
      account_id: account_id,
    })

    if (integrations.length === 0) {
      return {
        rows: [],
        cursor: null,
      }
    }

    if (application_id) {
      // version id is only available if application_id is available.
      const version_ids = !!version ? [version] : []
      const existing = integrations.find(
        (i) => i.application_id === application_id,
      )

      if (!existing) {
        return {
          rows: [],
          cursor: null,
        }
      }

      return grpc.reviews.findAll({
        application_ids: [application_id],
        country_ids,
        version_ids,
        cursor,
      })
    }

    return grpc.reviews.findAll({
      application_ids: integrations.map((i) => i.application_id),
      country_ids,
      cursor,
    })
  },
}
