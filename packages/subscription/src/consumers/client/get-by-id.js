import pg from '../../pg.js'

export default async function getById({ account_id, client_id }) {
  const client = await pg
    .select({
      client_id: 'c.client_id',
      total_base_client_purchase: 'c.total_base_client_purchase',
      total_base_developer_proceeds: 'c.total_base_developer_proceeds',
      device_type_id: 't.device_type_id',
      device_type_name: 't.name',
      provider_id: 'c.provider_id',
      country_id: 'c.country_id',
    })
    .from('clients as c')
    .where('c.client_id', client_id)
    .andWhere('c.account_id', account_id)
    .innerJoin('device_types as t', 't.device_type_id', 'c.device_type_id')
    .first()

  if (!client) {
    throw new Error(`Client not found`)
  }

  return client
}
