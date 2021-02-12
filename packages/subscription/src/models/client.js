import pg from '../pg.js'
import dayjs from 'dayjs'

export async function findAll(
  { account_id, application_id },
  { filter, limit = 10, cursor },
) {
  return pg
    .select({
      client_id: 'c.client_id',
      first_interaction: 'c.first_interaction',
      total_base_client_purchase: pg.raw(
        'ROUND(c.total_base_client_purchase, 2)',
      ),
      total_base_developer_proceeds: pg.raw(
        'ROUND(c.total_base_developer_proceeds, 2)',
      ),
      country_id: 'c.country_id',
      country_name: 'countries.name',
      device_type_id: 'c.device_type_id',
      device_type_name: 'device_types.name',
      provider_id: 'c.provider_id',
      provider_name: 'providers.name',
    })
    .from('clients as c')
    .innerJoin('countries', function () {
      this.using('country_id')
    })
    .join('device_types', function () {
      this.on('device_types.device_type_id', 'c.device_type_id').andOn(
        'device_types.provider_id',
        'c.provider_id',
      )
    })
    .join('providers', function () {
      this.on('c.provider_id', 'providers.provider_id')
    })
    .where('c.account_id', account_id)
    .andWhere(function () {
      if (application_id) {
        this.whereExists(function () {
          this.select('*')
            .from('client_subscriptions as s')
            .where(function () {
              this.where('s.application_id', application_id)
                .andWhereRaw('s.account_id = c.account_id')
                .andWhereRaw('c.client_id = s.client_id')
            })
        })
      }

      if (cursor) {
        const { first_interaction, client_id } = cursor

        if (!first_interaction || !client_id) {
          throw new Error(`Invalid cursor for pagination`)
        }

        this.whereRaw('c.first_interaction < ?', [first_interaction])
        this.andWhereRaw('c.client_id < ?', [client_id])
      }

      if (filter?.from && filter?.to) {
        this.andWhereBetween('c.first_interaction', [
          dayjs(filter.from).format('YYYY-MM-DD'),
          dayjs(filter.to).format('YYYY-MM-DD'),
        ])
      }
    })
    .orderBy([
      { column: 'c.first_interaction', order: 'desc' },
      { column: 'c.client_id', order: 'desc' },
    ])
    .limit(limit ?? 10)
}
