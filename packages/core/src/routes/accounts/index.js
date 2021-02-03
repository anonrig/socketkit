import statistics from './statistics.js'
import countries from './countries.js'

export default (f, _opts, done) => {
  f.route(statistics)
  f.route(countries)
  done()
}
