import pg from '../pg.js'

export const findByPk = async ({ device_type_id, provider_id }) =>
  pg
    .select('*')
    .from('device_types')
    .where({ device_type_id, provider_id })
    .first()

export const findOrCreateByPk = async (
  { device_type_id, provider_id },
  { name },
) =>
  (await findByPk({ device_type_id, provider_id })) ??
  (await create({ device_type_id, provider_id, name }))

export const create = async ({ provider_id, device_type_id, name }) =>
  pg
    .insert({
      provider_id,
      device_type_id,
      name,
    })
    .into('device_types')
    .returning('*')
