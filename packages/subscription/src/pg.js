import knex from 'knex'
import config from '../knexfile.js'
import pg from 'pg'
import range from 'pg-range'

pg.types.setTypeParser(20, 'text', parseInt)
range.install(pg)

export default knex(config)
