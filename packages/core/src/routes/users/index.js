import getIntegrations from './get-integrations.js'
import upsertIntegration from './upsert-integration.js'

export default (f, _opts, done) => {
  f.route(getIntegrations)
  f.route(upsertIntegration)
  done()
}
