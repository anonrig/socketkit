import pg from '../pg.js'
import stripe from '../stripe.js'
import config from '../config.js'

export async function findOrCreate({ account_id, name, email }) {
  const environment = config.stripe.key.includes('test')
    ? 'staging'
    : 'production'

  return pg.transaction(async (trx) => {
    const existing = await pg
      .queryBuilder()
      .select('*')
      .from('integrations')
      .where({ account_id, environment })
      .transacting(trx)
      .first()

    if (existing) {
      return existing
    }

    const { id } = await stripe.customers.create({ name, email })

    return pg
      .queryBuilder()
      .insert({
        account_id,
        stripe_id: id,
        environment,
      })
      .into('integrations')
      .transacting(trx)
  })
}
