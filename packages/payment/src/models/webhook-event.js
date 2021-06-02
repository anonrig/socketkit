import dayjs from 'dayjs'
import stripe from '../stripe.js'
import pg from '../pg.js'
import { integrations } from '../grpc-client.js'

export async function updateSubscription({ subscription, customer }) {
  const { status, cancel_at, current_period_start, current_period_end } =
    await stripe.subscriptions.retrieve(subscription)

  const [{ account_id }] = await pg
    .queryBuilder()
    .update({
      state: status,
      subscription_id: subscription,
      started_at: dayjs(current_period_start * 1000),
      expired_at: dayjs((cancel_at ?? current_period_end) * 1000),
      updated_stripe_at: pg.raw(
        `CASE WHEN updated_stripe_at IS NULL THEN ? ELSE updated_stripe_at END`,
        [dayjs(current_period_start).subtract(1, 'day').format('YYYY-MM-DD')],
      ),
    })
    .from('integrations')
    .where({ stripe_id: customer })
    .returning(['account_id'])

  const attributes = { account_id, provider_id: 'apple' }

  if (['unpaid', 'canceled', 'ended'].includes(status)) {
    await integrations.update({ ...attributes, state: 'suspended' })
  } else if (status === 'active') {
    await integrations.update({ ...attributes, state: 'active' })
  }
}

export async function cancelSubscription({ subscription, customer }) {
  const { status, cancel_at, current_period_start, current_period_end } =
    await stripe.subscriptions.retrieve(subscription)

  const [{ account_id }] = await pg
    .queryBuilder()
    .update({
      state: status,
      subscription_id: subscription,
      started_at: dayjs(current_period_start * 1000),
      expired_at: dayjs((cancel_at ?? current_period_end) * 1000),
      updated_stripe_at: dayjs().format('YYYY-MM-DD'),
    })
    .from('integrations')
    .where({ stripe_id: customer })
    .returning(['account_id'])

  await integrations.update({
    account_id,
    provider_id: 'apple',
    state: 'suspended',
  })
}
