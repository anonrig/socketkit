import stripe from '../stripe.js'
import * as Integrations from './integrations.js'
import config from '../config.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('subscriptions')

export async function updateUsage({ account_id, usage }) {
  const { stripe_id } = await Integrations.findOrCreate({ account_id })
  const {
    data: [subscription],
  } = await stripe.subscriptions.list({
    customer: stripe_id,
  })

  const metered = subscription?.items.data.filter(
    (d) => d.id === config.products.USAGE_FEE,
  )

  if (metered) {
    logger
      .withTag('updateUsage')
      .success(
        `Usage record updated for account_id=${account_id} with usage=${usage}`,
      )
    await stripe.subscriptionItems.createUsageRecord(metered.id, {
      quantity: usage,
      timestamp: Date.now(),
      action: 'set',
    })
  } else {
    logger
      .withTag('updateUsage')
      .fatal(
        `Usage record failed to find metered subscription for account_id=${account_id}`,
      )
  }
}
