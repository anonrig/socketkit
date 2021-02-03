import getAll from './all.js'
import getById from './get-by-id.js'
import getTransactions from './get-transactions.js'
import getSubscriptions from './get-subscriptions.js'

export default (f, _opts, done) => {
  f.route(getAll)
  f.route(getById)
  f.route(getTransactions)
  f.route(getSubscriptions)
  done()
}
