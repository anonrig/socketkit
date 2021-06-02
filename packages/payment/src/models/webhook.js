import stripe from '../stripe.js'
import config from '../config.js'
import Logger from '../logger.js'

import { updateSubscription, cancelSubscription } from './webhook-event.js'

const logger = Logger.create().withScope('webhook')

export async function validate({ payload, signature }) {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe.signing_key,
  )

  logger.withTag('validate').info(`Received webhook event=${event.type}`)

  switch (event.type) {
    // customer trial will end and convert to paid
    case 'customer.subscription.trial_will_end':
      break
    // remove the customer’s access to the product
    case 'customer.subscription.deleted':
      await cancelSubscription({
        subscription: event.data.object.id,
        customer: event.data.object.customer,
      })
      break
    // existing subscription will be renewed in the upcoming days.
    case 'invoice.upcoming':
      break
    // existing subscription is renewed.
    // current_period_end is updated on `invoice.paid`
    // https://stripe.com/docs/api/invoices/object
    case 'invoice.paid':
      await updateSubscription({
        subscription: event.data.object.subscription,
        customer: event.data.object.customer,
      })
      break
    // fails due to card error
    case 'invoice.payment_action_required':
      break
    // customer payment failed. inform them
    case 'invoice.payment_failed':
      break
  }
}
