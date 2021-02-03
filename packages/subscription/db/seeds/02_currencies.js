import currencies from '../fixtures/currencies.json'

export const seed = async (knex) => {
  const normalized = Object.keys(currencies).map((currency_id) => ({
    currency_id,
    name: currencies[currency_id].name,
    symbol: currencies[currency_id].symbol.grapheme,
  }))
  await knex('currencies').del()
  await knex('currencies').insert(normalized)
}
