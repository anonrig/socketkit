import findAll from './all.js'
import applicationVersions from './application-versions.js'

export default (f, _opts, done) => {
  f.route(findAll)
  f.route(applicationVersions)
  done()
}
