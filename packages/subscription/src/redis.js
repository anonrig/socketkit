import Queue from 'bull'
import config from './config.js'

const options = {
  redis: {
    name: 'redis-prod',
    host: config.redis.host,
    password: config.redis.password,
    port: 6379,
  },
}

export const appstoreQueue = new Queue('appstore-worker', options)
