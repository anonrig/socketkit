/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS reviews_watchlist (
      application_id text NOT NULL,
      country_id text NOT NULL,
      last_fetch timestamptz NOT NULL DEFAULT now(),
      is_active boolean NOT NULL default true,
      last_error_message text,
      failed_fetches int NOT NULL DEFAULT 0,
      
      PRIMARY KEY (application_id, country_id),
      CHECK (country_id ~ '\\A[a-z]{2}\\Z'),
      FOREIGN KEY (application_id) REFERENCES applications,
    
      CONSTRAINT reviews_watchlist_last_error_message_check
        CHECK (is_active = true OR last_error_message IS NOT NULL)
    );
  `)
}

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('reviews_watchlist')
}
