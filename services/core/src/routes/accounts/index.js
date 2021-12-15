import countries from './countries.js'
import statistics from './statistics.js'

export default (f, _opts, done) => {
  f.route(statistics)
  f.route(countries)
  done()
}
