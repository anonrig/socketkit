import applications from './applications/index.js'
import accounts from './accounts/index.js'
import integrations from './integrations/index.js'
import customers from './customers/index.js'
import transactions from './transactions/index.js'
import reports from './reports/index.js'
import search from './search/index.js'
import reviews from './reviews/index.js'
import payments from './payments/index.js'

export default (f, _opts, done) => {
  f.register(applications, { prefix: 'applications' })
  f.register(accounts, { prefix: 'accounts' })
  f.register(integrations, { prefix: 'integrations' })
  f.register(customers, { prefix: 'customers' })
  f.register(transactions, { prefix: 'transactions' })
  f.register(reports, { prefix: 'reports' })
  f.register(search, { prefix: 'search' })
  f.register(reviews, { prefix: 'reviews' })
  f.register(payments, { prefix: 'payments' })
  done()
}
