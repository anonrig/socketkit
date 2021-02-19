import trials from './trials.js'

export default (f, _opts, done) => {
  f.route(trials)
  done()
}
