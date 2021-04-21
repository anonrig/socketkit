import stripe from '../stripe.js'
import pg from '../pg.js'

export async function updateInvoice(event) {
  const invoice = event.data.object
  const {
    status: subscription_state,
    current_period_end,
    latest_invoice: { payment_intent },
  } = await stripe.subscriptions.retrieve(invoice.subscription)
  await pg
    .queryBuilder()
    .update({
      current_period_end,
      payment_intent_status: payment_intent.status,
      payment_status: invoice.status,
      subscription_state,
    })
    .from('integrations')
    .where({ stripe_id: invoice.customer })
}
