import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

const region_names = new Intl.DisplayNames(['en'], { type: 'region' })

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
                country_name: { type: 'string' },
                score: { type: 'number' },
                username: { type: 'string' },
                user_url: { type: 'string' },
                review_url: { type: 'string' },
                title: { type: 'string' },
                content: { type: 'string' },
                updated_at: { type: 'string' },
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
            },
          },
        },
        required: ['cursor', 'rows'],
      },
    },
  },
  preHandler: verify,
  handler: async ({ accounts: [{ account_id }], query }) => {
    const country_ids = query.country_id ? [query.country_id] : []
    const { rows: integrations } = await grpc.storeIntegrations.findAll({
      account_id: account_id,
    })

    if (integrations.length === 0) {
      return {
        rows: [],
        cursor: null,
      }
    }

    if (query.application_id) {
      if (
        !integrations.find(
          ({ application_id }) => application_id === query.application_id,
        )
      ) {
        return {
          rows: [],
          cursor: null,
        }
      }

      const { cursor, rows } = await grpc.reviews.findAll({
        application_ids: [query.application_id],
        country_ids,
        version_ids: query.version ? [query.version] : [],
        cursor: query.cursor,
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
      cursor,
    })

    return {
      cursor,
      rows: rows.map((r) => ({
        ...r,
        country_name: region_names.of(r.country_id.toUpperCase()),
      })),
    }
  },
}
