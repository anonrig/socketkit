import findAll from './all.js'
import applicationVersions from './application-versions.js'
import countries from './countries.js'

export default (f, _opts, done) => {
  f.route(findAll)
  f.route(applicationVersions)
  f.route(countries)
  done()
}
