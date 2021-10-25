import appstoreConnect from './appstore-connect/index.js'
import reviews from './reviews/index.js'
import tracking from './tracking/index.js'

export default (f, _opts, done) => {
  f.register(appstoreConnect, { prefix: 'appstore-connect' })
  f.register(reviews, { prefix: 'reviews' })
  f.register(tracking, { prefix: 'tracking' })
  done()
}
