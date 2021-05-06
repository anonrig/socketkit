import dayjs from 'dayjs'
import stripe from '../stripe.js'
import pg from '../pg.js'

export async function updateSubscription({ subscription, customer }) {
  const {
    status,
    cancel_at,
    current_period_start,
    current_period_end,
  } = await stripe.subscriptions.retrieve(subscription)

  await pg
    .queryBuilder()
    .update({
      state: status,
      subscription_id: subscription,
      started_at: dayjs(current_period_start * 1000),
      expired_at: dayjs((cancel_at ?? current_period_end) * 1000),
    })
    .from('integrations')
    .where({ stripe_id: customer })
}
