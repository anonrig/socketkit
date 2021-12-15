import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

const region_names = new Intl.DisplayNames(['en'], { type: 'region' })

export default {
  handler: async ({ accounts: [{ account_id }], query }) => {
    const country_ids = query.country_id ? [query.country_id] : []
    const { rows: integrations } = await grpc.storeIntegrations.findAll({
      account_id: account_id,
    })

    if (integrations.length === 0) {
      return {
        cursor: null,
        rows: [],
      }
    }

    if (query.application_id) {
      if (!integrations.find(({ application_id }) => application_id === query.application_id)) {
        return {
          cursor: null,
          rows: [],
        }
      }

      const { cursor, rows } = await grpc.reviews.findAll({
        application_ids: [query.application_id],
        country_ids,
        cursor: query.cursor,
        version_ids: query.version ? [query.version] : [],
      })

      return {
        cursor,
        rows: rows.map((r) => ({
          ...r,
          country_name: region_names.of(r.country_id.toUpperCase()),
        })),
      }
    }

    const { cursor, rows } = await grpc.reviews.findAll({
      application_ids: integrations.map((i) => i.application_id),
      country_ids,
      cursor: query.cursor,
    })

    return {
      cursor,
      rows: rows.map((r) => ({
        ...r,
        country_name: region_names.of(r.country_id.toUpperCase()),
      })),
    }
  },
  method: 'GET',
  path: '/',
  preHandler: verify,
  schema: {
    querystring: {
      properties: {
        application_id: { type: 'string' },
        country_id: { type: 'string' },
        cursor: {
          properties: {
            review_id: { type: 'string' },
            updated_at: { type: 'string' },
          },
          required: ['review_id', 'updated_at'],
          type: 'object',
        },
        version: { type: 'string' },
      },
      required: [],
      type: 'object',
    },
    response: {
      200: {
        properties: {
          cursor: {
            properties: {
              review_id: { type: 'string' },
              updated_at: { type: 'string' },
            },
            required: ['review_id', 'updated_at'],
            type: ['object', 'null'],
          },
          rows: {
            items: {
              properties: {
                application_id: { type: 'string' },
                content: { type: 'string' },
                country_id: { type: 'string' },
                country_name: { type: 'string' },
                review_id: { type: 'string' },
                review_url: { type: 'string' },
                score: { type: 'number' },
                title: { type: 'string' },
                updated_at: { type: 'string' },
                user_url: { type: 'string' },
                username: { type: 'string' },
                version_number: { type: 'string' },
              },
              required: [
                'review_id',
                'application_id',
                'version_number',
                'country_id',
                'country_name',
                'score',
                'username',
                'user_url',
                'review_url',
                'title',
                'content',
                'updated_at',
              ],
              type: 'object',
            },
            type: 'array',
          },
        },
        required: ['cursor', 'rows'],
        type: 'object',
      },
    },
  },
}
