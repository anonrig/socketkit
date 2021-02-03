import getAll from './all.js'
import getBySlug from './get-by-slug.js'

export default (f, _opts, done) => {
  f.route(getAll)
  f.route(getBySlug)
  done()
}
