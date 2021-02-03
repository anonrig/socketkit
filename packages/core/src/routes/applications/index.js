import getAll from './all.js'
import getById from './get-by-id.js'
import getStatistics from './get-statistics.js'
import getCustomers from './get-customers.js'
import getTransactions from './get-transactions.js'
import getPackages from './get-packages.js'
import getCountries from './get-countries.js'

export default (f, _opts, done) => {
  f.route(getAll)
  f.route(getById)
  f.route(getStatistics)
  f.route(getCustomers)
  f.route(getTransactions)
  f.route(getPackages)
  f.route(getCountries)
  done()
}
