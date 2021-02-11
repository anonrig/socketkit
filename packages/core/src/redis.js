import Queue from 'bull'
import config from './config.js'

const options = {
  redis: {
    tls: true,
    name: 'core',
    username: config.redis.username,
    password: config.redis.password,
    host: config.redis.host,
    port: config.redis.port,
  },
}

export const appstoreQueue = new Queue('appstore-worker', options)
export const coreQueue = new Queue('core-worker', options)
