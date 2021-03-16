import subscription from './subscription.js'

export default (f, _opts, done) => {
  f.route(subscription)
  done()
}
