import applications from './applications.js'

export default (f, _opts, done) => {
  f.route(applications)
  done()
}
