import getAll from './all.js'
import getBySlug from './by-slug.js'
import updateBySlug from './update-by-slug.js'
import deleteBySlug from './delete-by-slug.js'

export default (f, _opts, done) => {
  f.route(getAll)
  f.route(getBySlug)
  f.route(updateBySlug)
  f.route(deleteBySlug)
  done()
}
