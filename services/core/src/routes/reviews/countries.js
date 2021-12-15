import _ from 'lodash'

import grpc from '../../grpc.js'
import { verify } from '../../hooks.js'

export default {
  handler: async ({ accounts: [{ account_id }] }) => {
    const { rows } = await grpc.reviews.findCountries({ account_id })

    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
    return {
      rows: _.sortBy(
        rows.map(({ country_id }) => ({
          country_id,
          name: regionNames.of(country_id.toUpperCase()),
        })),
        ['name'],
        ['asc'],
      ),
    }
  },
  method: 'GET',
  path: '/countries',
  preHandler: verify,
  schema: {
    response: {
      200: {
        properties: {
          rows: {
            items: {
              properties: {
                country_id: { type: 'string' },
                name: { type: 'string' },
              },
              required: ['country_id', 'name'],
              type: 'object',
            },
            type: 'array',
          },
        },
        required: ['rows'],
        type: 'object',
      },
    },
  },
}
