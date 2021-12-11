/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS integrations (
      account_id uuid NOT NULL,
      provider_id text NOT NULL,
      requirement jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      last_error_message text,
      is_active boolean NOT NULL DEFAULT true,
      failed_requests int NOT NULL default 0,
    
      PRIMARY KEY (account_id, provider_id)
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
