import { loadStripe } from '@stripe/stripe-js'
import { stripeKey } from 'helpers/config.js'

let stripePromise = null

export default function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(stripeKey)
  }
  return stripePromise
}
