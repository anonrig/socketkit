import trials from './trials.js'
import mrr from './mrr.js'
import averageDuration from './average-duration.js'

export default (f, _opts, done) => {
  f.route(averageDuration)
  f.route(trials)
  f.route(mrr)
  done()
}
