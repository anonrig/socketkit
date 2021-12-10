/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS integrations (
      account_id text NOT NULL,
      application_id text NOT NULL,
      country_id text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
    
      PRIMARY KEY (account_id, application_id, country_id),
      FOREIGN KEY (application_id, country_id) REFERENCES reviews_watchlist
    );
  `)
}

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('integrations')
}
