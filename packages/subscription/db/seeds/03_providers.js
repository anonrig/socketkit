import providers from '../fixtures/providers.json'

export const seed = async (knex) => {
  const normalized = providers.map((provider) => ({
    provider_id: provider.id,
    name: provider.name,
  }))
  await knex('providers').del()
  await knex('providers').insert(normalized)
}
