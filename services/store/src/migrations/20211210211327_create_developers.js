/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS developers (
      developer_id text NOT NULL,
      name text NOT NULL,
      store_url text NOT NULL,
      website text,
    
      PRIMARY KEY (developer_id)
    );
  `)
}

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('developers')
}
