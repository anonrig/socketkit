import grpc from '@grpc/grpc-js'

import pg from '../pg.js'
import stripe from '../stripe.js'
import config from '../config.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('integrations')
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
    .returning('*')
}

export function update({ account_id, stripe_id }) {
  return pg
    .queryBuilder()
    .update({ stripe_id })
    .from('integrations')
    .where({ account_id, environment })
}

export async function findOrCreate({ account_id, name, email }) {
  return pg.transaction(async (trx) => {
    const existing = await findOne({ account_id }).transacting(trx)

    if (existing) {
      return existing
    }

    // we created the integration first in order to solve race conditions
    // due to network latency between stripe and us. this prevents duplicate stripe
    // requests
    await create({ account_id }).transacting(trx)
    const { id } = await stripe.customers.create({ name, email })
    await update({ account_id, stripe_id: id }).transacting(trx)
  })
}
