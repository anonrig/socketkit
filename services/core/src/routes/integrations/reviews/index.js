import getAll from './get.js'
import updateOne from './update.js'

export default (f, _opts, done) => {
  f.route(getAll)
  f.route(updateOne)
  done()
}
