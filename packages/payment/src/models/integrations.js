import pg from '../pg.js'
import stripe from '../stripe.js'
import config from '../config.js'

const environment = config.stripe.key.includes('test')
  ? 'staging'
  : 'production'

export function findOne({ account_id }) {
  return pg
    .queryBuilder()
    .select('*')
    .from('integrations')
    .where({ account_id, environment })
    .first()
}

export function create({ account_id, stripe_id }) {
  return pg
    .queryBuilder()
    .insert({ account_id, stripe_id, environment })
    .into('integrations')
}

export function update({ account_id, stripe_id }) {
  return pg
    .queryBuilder()
    .update({ stripe_id })
    .from('integrations')
    .where({ account_id, environment })
    .returning('*')
}

export async function findOrCreate({ account_id, name, email }) {
  const exists = await findOne({ account_id }).whereNotNull('stripe_id')

  if (exists) {
    return exists
  }

  return pg.transaction(async (trx) => {
    // returning doesnt work with onConflict statements on knexjs.
    // fix this when knexjs does solve it.
    await create({ account_id })
      .onConflict(['account_id', 'environment'])
      .ignore()
      .transacting(trx)

    const existing = await findOne({ account_id }).transacting(trx)

    if (!!existing.stripe_id) {
      return existing
    }

    const { id } = await stripe.customers.create({ name, email })
    const [row] = await update({ account_id, stripe_id: id }).transacting(trx)
    return row
  })
}
