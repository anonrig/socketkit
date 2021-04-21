import stripe from '../stripe.js'
import config from '../config.js'
import Logger from '../logger.js'
import pg from '../pg.js'

import { updateInvoice } from './webhook-event.js'

const logger = Logger.create().withScope('webhook')

export async function validate({ payload, signature }) {
  const event = stripe.webhooks.constructEvent(
    JSON.stringify(payload),
    signature,
    config.stripe.key,
  )

  logger.withTag('validate').info(`Received webhook event=${event.type}`)

  switch (event.type) {
    // customer checkout session is finalized
    // store current_period_end timestamp
    case 'checkout.session.completed':
      const session = event.data.object
      const subscription_id = session.subscription
      const {
        status: subscription_state,
        current_period_end,
        latest_invoice: { payment_intent },
      } = await stripe.subscriptions.retrieve(subscription_id)

      await pg
        .queryBuilder()
        .update({
          subscription_id,
          payment_intent_status: payment_intent.status,
          payment_status: session.payment_status,
          subscription_state,
          current_period_end,
        })
        .from('integrations')
        .where({ stripe_id: session.customer })
      break
    // customer trial will end and convert to paid
    case 'customer.subscription.trial_will_end':
      break
    // remove the customer’s access to the product
    case 'customer.subscription.deleted':
      break
    // existing subscription will be renewed in the upcoming days.
    case 'invoice.upcoming':
      break
    // existing subscription is renewed.
    // current_period_end is updated on `invoice.paid`
    // https://stripe.com/docs/api/invoices/object
    case 'invoice.paid':
      await updateInvoice(event)
      break
    // fails due to card error
    case 'invoice.payment_action_required':
      await updateInvoice(event)
      break
    // customer payment failed. inform them
    case 'invoice.payment_failed':
      await updateInvoice(event)
      break
  }
}
