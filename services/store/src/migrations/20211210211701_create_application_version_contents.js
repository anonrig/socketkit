/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS application_version_contents (
      application_id text NOT NULL,
      fetched_country_id text NOT NULL,
      language_id text NOT NULL,
      version_number text NOT NULL,
      title text NOT NULL,
      description text NOT NULL,
      release_notes text NOT NULL,
      screenshots json NOT NULL,
    
      PRIMARY KEY (application_id, version_number, language_id),
      CONSTRAINT application_version_contents_application_releases_fkey
        FOREIGN KEY (application_id, fetched_country_id)
        REFERENCES application_releases (application_id, country_id),
      CONSTRAINT application_version_contents_application_versions_fkey
        FOREIGN KEY (application_id, version_number)
        REFERENCES application_versions,
      CHECK (language_id ~ '\\A[A-Z]{2}\\Z')
    );
    
    ALTER TABLE application_releases
      ADD CONSTRAINT application_releases_application_version_contents_fkey
        FOREIGN KEY (application_id, latest_version_number, default_language_id)
        REFERENCES application_version_contents (application_id, version_number, language_id)
        DEFERRABLE INITIALLY DEFERRED;
    
    ALTER TABLE application_versions
      ADD CONSTRAINT application_version_application_version_contents_fkey
        FOREIGN KEY (application_id, version_number, default_language_id)
        REFERENCES application_version_contents (application_id, version_number, language_id)
        DEFERRABLE INITIALLY DEFERRED;
  `)
}

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
  await knex.schema.raw(
    `ALTER TABLE application_releases DROP CONSTRAINT IF EXISTS application_releases_application_version_contents_fkey RESTRICT;`,
  )
  await knex.schema.raw(
    `ALTER TABLE application_versions DROP CONSTRAINT IF EXISTS application_version_application_version_contents_fkey RESTRICT;`,
  )
  return knex.schema.dropTableIfExists('application_version_contents')
}
