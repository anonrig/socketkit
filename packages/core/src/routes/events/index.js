import all from './all.js'

export default (f, _opts, done) => {
  f.route(all)
  done()
}
