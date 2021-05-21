import dayjs from 'dayjs'
import stripe from '../stripe.js'
import config from '../config.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('subscriptions')

export async function updateUsage({ stripe_id, usage, for_date }) {
  const {
    data: [subscription],
  } = await stripe.subscriptions.list({
    customer: stripe_id,
  })

  const metered = subscription?.items.data.find(
    (d) => d.id === config.products.USAGE_FEE,
  )

  if (metered) {
    logger
      .withTag('updateUsage')
      .success(
        `Usage record updated for stripe_id=${stripe_id} with usage=${usage}`,
      )
    await stripe.subscriptionItems.createUsageRecord(metered.id, {
      quantity: usage,
      timestamp: dayjs(for_date).format('YYYY-MM-DD'),
      action: 'increment',
    })
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
