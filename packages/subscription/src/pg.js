import knex from 'knex'
import config from '../knexfile.js'
import pg from 'pg'
import range from 'pg-range'

range.install(pg)

export default knex(config)
