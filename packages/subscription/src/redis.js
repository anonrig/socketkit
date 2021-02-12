import Queue from 'bull'
import config from './config.js'

export const appstoreQueue = new Queue('appstore-worker', {
  redis: {
    tls: true,
    name: 'subscription',
    username: config.redis.username,
    password: config.redis.password,
    host: config.redis.host,
    port: config.redis.port,
  },
})
