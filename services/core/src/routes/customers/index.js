import getAll from './all.js'
import getById from './by-id.js'
import getSubscriptions from './subscriptions.js'
import getTransactions from './transactions.js'

export default (f, _opts, done) => {
  f.route(getAll)
  f.route(getById)
  f.route(getTransactions)
  f.route(getSubscriptions)
  done()
}
