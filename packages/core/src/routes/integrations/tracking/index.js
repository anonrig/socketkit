import findAll from './find-all.js'
import findOne from './find-one.js'
import create from './create.js'
import update from './update.js'
import destroy from './destroy.js'

export default (f, _opts, done) => {
  f.route(findAll)
  f.route(findOne)
  f.route(create)
  f.route(update)
  f.route(destroy)
  done()
}
