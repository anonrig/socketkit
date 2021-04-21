import * as Integrations from './integrations.js'
import stripe from '../stripe.js'
import config from '../config.js'

export async function createPortal({ account_id }) {
  const { stripe_id } = await Integrations.findOrCreate({ account_id })
  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_id,
    return_url: config.stripe.portal_return_url,
  })

  return session
}

export async function createCheckout({ account_id }) {
  const { stripe_id } = await Integrations.findOrCreate({ account_id })
  const session = await stripe.checkout.sessions.create({
    customer: stripe_id,
    payment_method_types: ['card'],
    line_items: [
      { price: config.products.usage_based },
      { price: config.products.flat_fee_based, quantity: 1 },
    ],
    mode: 'subscription',
    billing_address_collection: 'required',
    success_url: config.stripe.checkout_success_url,
    cancel_url: config.stripe.checkout_cancel_url,
    subscription_data: {
      trial_period_days: 14,
    },
  })

  return session
}
