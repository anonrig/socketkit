import path from 'path'

import Mali from 'mali'

import config from './config.js'
import * as Applications from './consumers/index.js'
import * as Integrations from './consumers/integrations.js'
import * as Reviews from './consumers/reviews.js'
import performancePlugin from './grpc.performance.js'
import logger from './logger.js'

const file = path.join(path.resolve(''), 'protofiles/store.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')

export function build() {
  const app = new Mali(file, ['Reviews', 'Applications', 'Integrations'], config.grpc_options)

  app.addService(health, 'Health', config.grpc_options)

  /* c8 ignore start */
  if (config.isDevelopment) {
    app.use(performancePlugin)
  }
  /* c8 ignore end */

  app.use({ Applications, Integrations, Reviews })
  app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

  /* c8 ignore start */
  app.on('error', (error) => {
    if (!error.code) {
      logger.fatal(error)
    }
  })
  /* c8 ignore end */

  return app
}
