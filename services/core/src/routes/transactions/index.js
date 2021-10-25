import getAll from './all.js'

export default (f, _opts, done) => {
  f.route(getAll)
  done()
}
