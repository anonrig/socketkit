import config from './config.js'

export default {
  development: config.knex,
  production: config.knex,
  staging: config.knex,
}
