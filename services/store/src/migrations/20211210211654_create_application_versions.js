/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS application_versions (
      released_at timestamptz NOT NULL,
      application_id text NOT NULL,
      version_number text NOT NULL,
      icon text NOT NULL,
      size text NOT NULL,
      required_os_version text NOT NULL,
      language_ids text[] NOT NULL DEFAULT '{}',
      website text,
      content_rating text NOT NULL,
      default_language_id text NOT NULL,
    
      PRIMARY KEY (application_id, version_number),
      CONSTRAINT application_versions_applications_fkey
        FOREIGN KEY (application_id) REFERENCES applications,
      CONSTRAINT application_versions_language_ids_check
        CHECK (
          array_length(language_ids, 1) > 0 AND
          array_length(language_ids, 2) IS NULL AND
          default_language_id = ANY (language_ids)
        )
    );
  `)
}

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('application_versions')
}
