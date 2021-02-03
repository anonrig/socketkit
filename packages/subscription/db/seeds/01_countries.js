import countries from '../fixtures/countries.json'

export const seed = async (knex) => {
  const normalized = countries.map((country) => ({
    country_id: country.country_code,
    name: country.name,
    coordinates: knex.raw(`point(${country.latlng.join(', ')})`),
    capital: country.capital,
    timezones: country.timezones,
  }))
  await knex('countries').del()
  await knex('countries').insert(normalized)
}
