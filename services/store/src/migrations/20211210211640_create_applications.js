/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS applications (
      last_fetch timestamptz NOT NULL DEFAULT now(),
      released_at timestamptz NOT NULL,
      application_id text NOT NULL,
      developer_id text NOT NULL,
      bundle_id text NOT NULL,
      default_country_id text NOT NULL,
      failed_fetches int NOT NULL DEFAULT 0,
      is_active boolean NOT NULL default true,
      last_error_message text,
    
      PRIMARY KEY (application_id),
      UNIQUE (bundle_id),
      FOREIGN KEY (developer_id) REFERENCES developers,
      CONSTRAINT applications_last_fetch_check
        CHECK (last_fetch >= released_at),
      CONSTRAINT applications_last_error_message_check
        CHECK (is_active OR last_error_message IS NOT NULL),
      CONSTRAINT applications_failed_fetches_check
        CHECK (
          CASE 
            WHEN failed_fetches = 0 THEN last_error_message IS NULL
            WHEN failed_fetches > 0 THEN last_error_message IS NOT NULL
            ELSE false -- Negative values are not allowed
          END
        )
    );
    
    CREATE INDEX applications_last_fetch_idx ON applications (last_fetch);
  `)
}

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
  await knex.schema.raw('DROP INDEX IF EXISTS applications_last_fetch_idx;')
  await knex.schema.dropTableIfExists('applications')
}
