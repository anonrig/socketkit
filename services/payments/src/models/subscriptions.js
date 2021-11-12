import dayjs from 'dayjs'
import stripe from '../stripe.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('subscriptions')

export async function updateUsage({ stripe_id, usage, for_date }) {
  const { data: subscriptions } = await stripe.subscriptions.list({
    customer: stripe_id,
  })

  if (subscriptions.length === 0) {
    return logger
      .withTag('updateUsage')
      .debug('Customer does not have a valid subscription.')
  }

  const subscription = subscriptions.find((subscription) =>
    subscription.items.data.find((i) => i.plan.billing_scheme === 'per_unit'),
  )

  if (subscription) {
    const checking_date = dayjs(for_date).unix()
    const { current_period_start, current_period_end } = subscription
    if (
      current_period_start > checking_date ||
      checking_date > current_period_end
    ) {
      return logger
        .withTag('updateUsage')
        .debug('Customer period does not match the update usage for_date')
    }
  }

  const metered = subscription?.items.data.find(
    (i) => i.plan.billing_scheme === 'per_unit',
  )

  if (metered) {
    await stripe.subscriptionItems.createUsageRecord(metered.id, {
      quantity: usage,
      timestamp: dayjs(for_date).unix(),
      action: 'set',
    })

    logger
      .withTag('updateUsage')
      .success(
        `Usage record updated for stripe_id=${stripe_id} with usage=${usage}`,
      )
  } else {
    logger
      .withTag('updateUsage')
      .warn(
        `Usage record failed to find metered subscription for stripe_id=${stripe_id}`,
      )
  }
}

export async function retrieve({ subscription_id }) {
  return stripe.subscriptions.retrieve(subscription_id)
}
