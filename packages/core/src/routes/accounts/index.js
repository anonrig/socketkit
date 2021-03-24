import statistics from './statistics.js'
import countries from './countries.js'
import users from './users.js'

export default (f, _opts, done) => {
  f.route(statistics)
  f.route(countries)
  f.route(users)
  done()
}
