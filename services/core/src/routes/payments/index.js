import webhook from './webhook.js'
import portalSession from './portal.js'
import checkoutSession from './checkout.js'
import state from './state.js'

export default (f, _opts, done) => {
  f.route(webhook)
  f.route(portalSession)
  f.route(checkoutSession)
  f.route(state)
  done()
}
