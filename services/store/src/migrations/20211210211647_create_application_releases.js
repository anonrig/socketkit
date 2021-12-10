// eslint-disable

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS application_releases (
      reviews int NOT NULL,
      score float4 NOT NULL,
      price numeric(2) NOT NULL,
      application_id text NOT NULL,
      country_id text NOT NULL,
      store_url text NOT NULL,
      currency_id text NOT NULL,
      default_language_id text NOT NULL,
      latest_version_number text NOT NULL,
      rating_histogram int[] NOT NULL DEFAULT '{0,0,0,0,0}',
    
      PRIMARY KEY (application_id, country_id),
      CONSTRAINT application_releases_application_fkey
        FOREIGN KEY (application_id) REFERENCES applications,
      CHECK (country_id ~ '\\A[a-z]{2}\\Z')
    );
    
    ALTER TABLE applications
      ADD CONSTRAINT applications_application_releases_fkey
        FOREIGN KEY (application_id, default_country_id)
        REFERENCES application_releases (application_id, country_id)
        DEFERRABLE INITIALLY DEFERRED;
   `)
}

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
  await knex.schema.raw(
    `ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_application_releases_fkey RESTRICT;`,
  )
  return knex.schema.dropTableIfExists('application_releases')
}
