/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS reviews (
      review_id text NOT NULL,
      application_id text NOT NULL,
      version_number text NOT NULL,
      country_id text NOT NULL,
      score int NOT NULL,
      username text NOT NULL,
      user_url text NOT NULL,
      review_url text NOT NULL,
      title text NOT NULL,
      content text NOT NULL,
      updated_at timestamptz NOT NULL,
    
      PRIMARY KEY (review_id),
      FOREIGN KEY (application_id, country_id) REFERENCES reviews_watchlist
    );
    
    CREATE INDEX reviews_pagination_idx ON reviews (application_id, updated_at, review_id);
  `)
}

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
  await knex.schema.raw('DROP INDEX IF EXISTS reviews_pagination_idx;')
  return knex.schema.dropTableIfExists('reviews')
}
