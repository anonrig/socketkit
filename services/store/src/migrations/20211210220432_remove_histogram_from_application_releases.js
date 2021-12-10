/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
  await knex.raw('ALTER TABLE application_releases DROP COLUMN IF EXISTS rating_histogram;')
}

/**
 * @param {import('knex').Knex} knex Knex instance
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
  await knex.raw(
    `ALTER TABLE application_releases ADD COLUMN IF NOT EXISTS rating_histogram int[] NOT NULL DEFAULT '{0,0,0,0,0}';`,
  )
}
