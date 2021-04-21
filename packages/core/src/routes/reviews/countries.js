import _ from 'lodash'
import { verify } from '../../hooks.js'
import grpc from '../../grpc.js'

export default {
  method: 'GET',
  path: '/countries',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                country_id: { type: 'string' },
                name: { type: 'string' },
              },
              required: ['country_id', 'name'],
            },
          },
        },
        required: ['rows'],
      },
    },
  },
  preHandler: verify,
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
}
