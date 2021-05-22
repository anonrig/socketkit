import knex from 'knex'
import pg from 'pg'
import range from 'pg-range'

import config from '../config.js'

pg.types.setTypeParser(20, 'text', parseInt)
range.install(pg)

export default knex(config.knex)
