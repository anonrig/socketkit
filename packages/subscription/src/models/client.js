import pg from '../pg.js'
import dayjs from 'dayjs'

export async function count({ account_id, application_id }, { filter } = {}) {
  const { count } = await pg
    .count()
    .from('clients as c')
    .where(function () {
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

      this.andWhere('c.account_id', account_id)

      if (filter?.from && filter?.to) {
        this.andWhereBetween('c.first_interaction', [
          dayjs(filter.from).format('YYYY-MM-DD'),
          dayjs(filter.to).format('YYYY-MM-DD'),
        ])
      }
    })
    .first()

  return parseInt(count ?? '0')
}

export async function findAll(
  { account_id, application_id },
  { filter, limit = 10, offset = 0 },
) {
  return pg
    .select({
      client_id: 'c.client_id',
      client_first_interaction: 'c.first_interaction',
      client_total_base_client_purchase: pg.raw(
        'ROUND(c.total_base_client_purchase, 2)',
      ),
      client_total_base_developer_proceeds: pg.raw(
        'ROUND(c.total_base_developer_proceeds, 2)',
      ),
      country_id: 'c.country_id',
      country_name: 'countries.name',
    })
    .from('clients as c')
    .innerJoin('countries', function () {
      this.using('country_id')
    })
    .where(function () {
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

      this.andWhere('c.account_id', account_id)

      if (filter?.from && filter?.to) {
        this.andWhereBetween('c.first_interaction', [
          dayjs(filter.from).format('YYYY-MM-DD'),
          dayjs(filter.to).format('YYYY-MM-DD'),
        ])
      }
    })
    .orderByRaw('c.first_interaction desc')
    .limit(limit ?? 10)
    .offset(offset ?? 0)
}
