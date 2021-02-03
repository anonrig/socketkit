import pg from '../../pg.js'

export default async function getById({ account_id, client_id }) {
  const client = await pg
    .select({
      client_id: 'clients.client_id',
      client_total_base_client_purchase: 'clients.total_base_client_purchase',
      client_total_base_developer_proceeds:
        'clients.total_base_developer_proceeds',
      device_type_id: 'device_types.device_type_id',
      device_type_name: 'device_types.name',
      provider_id: 'clients.provider_id',
      provider_name: 'providers.name',
      country_id: 'countries.country_id',
      country_name: 'countries.name',
    })
    .from('clients')
    .where('clients.client_id', client_id)
    .andWhere('clients.account_id', account_id)
    .innerJoin('providers', 'providers.provider_id', 'clients.provider_id')
    .innerJoin('countries', 'countries.country_id', 'clients.country_id')
    .innerJoin(
      'device_types',
      'device_types.device_type_id',
      'clients.device_type_id',
    )
    .first()

  if (!client) {
    throw new Error(`Client not found`)
  }

  return client
}
