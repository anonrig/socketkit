import pg from '../../pg.js'

export default async function getById({ account_id, subscriber_id }) {
  const subscriber = await pg
    .select({
      subscriber_id: 'c.subscriber_id',
      total_base_subscriber_purchase: 'c.total_base_subscriber_purchase',
      total_base_developer_proceeds: 'c.total_base_developer_proceeds',
      device_type_id: 't.device_type_id',
      device_type_name: 't.name',
      provider_id: 'c.provider_id',
      country_id: 'c.country_id',
    })
    .from('subscribers as c')
    .where('c.subscriber_id', subscriber_id)
    .andWhere('c.account_id', account_id)
    .innerJoin('device_types as t', 't.device_type_id', 'c.device_type_id')
    .first()

  if (!subscriber) {
    throw new Error(`Subscriber not found`)
  }

  return subscriber
}
