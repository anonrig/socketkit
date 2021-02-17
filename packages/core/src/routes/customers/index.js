import getAll from './all.js'
import getById from './by-id.js'
import getTransactions from './transactions.js'
import getSubscriptions from './subscriptions.js'

export default (f, _opts, done) => {
  f.route(getAll)
  f.route(getById)
  f.route(getTransactions)
  f.route(getSubscriptions)
  done()
}
